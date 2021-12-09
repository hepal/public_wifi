<template>
  <div>
    <div id="cesiumContainer"></div>
    <Container
      :bg="
        currentMapStyle === 'mono' ? map_bg_dummy_mono : map_bg_dummy_satellite
      "
    >
      <MapControlled>
        <button>
          <img :src="ic_refresh" alt="" />
        </button>
        <button>
          <img :src="ic_zoom_in" alt="" />
        </button>
        <button>
          <img :src="ic_zoom_out" alt="" />
        </button>
      </MapControlled>
      <MapStyleSelector :isSelected="isMapStylerSelected">
        <Wrapper>
          <button v-on:click="isMapStylerSelected = !isMapStylerSelected">
            <img :src="ic_map_layer" alt="" />
            <span>맵스타일</span>
          </button>
          <ButtonMap
            :bg="img_map_style_mono"
            v-on:click="
              isMapStylerSelected = !isMapStylerSelected;
              currentMapStyle = 'mono';
            "
          >
            <span>모노크롬</span>
          </ButtonMap>
          <ButtonMap
            :bg="img_map_style_satellite"
            v-on:click="
              isMapStylerSelected = !isMapStylerSelected;
              currentMapStyle = 'satellite';
            "
          >
            <span>위성</span>
          </ButtonMap>
        </Wrapper>
      </MapStyleSelector>
    </Container>
  </div>
</template>

<script>
import {
  Viewer,
  Ion,
  Camera,
  Rectangle,
  BingMapsImageryProvider,
  BingMapsStyle,
  WebMapServiceImageryProvider,
  OpenStreetMapImageryProvider,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined as CesiumDefined,
  CesiumTerrainProvider,
  Cartesian3,
  Cartesian2,
  Color,
  VerticalOrigin,
  HeightReference,
  LabelStyle,
  Entity,
  ColorMaterialProperty,
  createOsmBuildings,
  CallbackProperty,
  PolylineGraphics,
  PolylineGeometry,
  PolygonGeometry,
  PointGraphics,
  Cartographic,
  createWorldTerrain,
  PolygonHierarchy,
  CzmlDataSource,
  Math as CesiumMath,
  HeadingPitchRoll,
  Transforms,
} from "cesium";

import Container from "./Container";
// 맵 영역 표시용 더미 이미지
import map_bg_dummy from "../../assets/dummy/map_bg_mono.jpg";
import styled from "vue-styled-components";
import bus_route from "../../assets/route/BUS_ALL_12_09.json";
import proj4 from "proj4/dist/proj4";
import HashMap from "hashmap";
//import mssql from 'mssql'
//const sql = require("msnodesqlv8");
//var mssql = require('mssql').default;
//var Connection = require('tedious').Connection;
//var Request = require('tedious').Request;
//var TYPES = require('tedious').TYPES;
//bus icon
import bus_icon from "../../assets/icon/bus/bus.png";

// 맵 영역 표시용 더미 이미지
import map_bg_dummy_mono from "../../assets/dummy/map_bg_mono.jpg";
import map_bg_dummy_satellite from "../../assets/dummy/map_bg_satellite.jpg";

// Assets
import ic_refresh from "../../assets/icon/action/refresh.svg";
import ic_zoom_in from "../../assets/icon/action/zoom_in.svg";
import ic_zoom_out from "../../assets/icon/action/zoom_out.svg";
import ic_map_layer from "../../assets/icon/layer.svg";
import img_map_style_mono from "../../assets/img/img_map_style_mono.jpg";
import img_map_style_satellite from "../../assets/img/img_map_style_satellite.jpg";

var busMap = null;

proj4.defs(
  "EPSG:5187",
  "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
//register(proj4);

function setMarkerInPos(positionCartographic, viewer) {
  console.log(
    "long: %s, lat: %s",
    CesiumMath.toDegrees(positionCartographic.longitude),
    CesiumMath.toDegrees(positionCartographic.latitude)
  );

  viewer.pickTranslucentDepth = true;
  const locationMarker = viewer.entities.add({
    name: "location",
    position: Cartesian3.fromRadians(
      positionCartographic.longitude,
      positionCartographic.latitude,
      10
    ),
    point: {
      pixelSize: 5,
      color: Color.RED,
      outlineColor: Color.WHITE,
      outlineWidth: 2,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
    },
    label: {
      text: "check",
      font: "14pt monospace",
      style: LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: VerticalOrigin.BOTTOM,
      pixelOffset: new Cartesian2(0, -9),
      heightReference: HeightReference.RELATIVE_TO_GROUND,
    },
  });
}

//버스 poi 리스트
var bus_pois = [];
var bus_lables = [];

var facilityUrl = "./images/bus.png";

function createSampleBusRoute() {
  let linePosString =
    '[{"X": 127.0616282045669, "Y": 37.644782138098435},{"X": 127.06394485670444, "Y": 37.645432137572854},{"X": 127.06634919695142, "Y": 37.646094961197136},{"X": 127.06960943453808, "Y": 37.649087942133185},{"X": 127.07297452619258, "Y": 37.65136654739722},{"X": 127.07427763401154, "Y": 37.6545510443615},{"X": 127.07510931530567, "Y": 37.657638623057316},{"X": 127.07254219926395, "Y": 37.65985131704873},{"X": 127.06938331855696, "Y": 37.66252210838101},{"X": 127.06719138150517, "Y": 37.664047436738485},{"X": 127.06627182710909, "Y": 37.66430054219336},{"X": 127.06343326185048, "Y": 37.66469274575584},{"X": 127.06231660115802, "Y": 37.66504814404419},{"X": 127.06116131873159, "Y": 37.664990433174275}]';

  let linePos = JSON.parse(linePosString);

  let line_positions = [];

  let i = 0;
  for (let i = 0; i < linePos.length; i++) {
    let cart3 = Cartesian3.fromDegrees(linePos[i].X, linePos[i].Y);
    line_positions.push(cart3);
  }

  var line = this.viewer.entities.add({
    name: "Green line",
    polyline: {
      positions: line_positions,
      width: 10,
      material: Color.GREEN,
      clampToGround: true,
    },
  });

  for (i = 0; i < linePos.length; i++) {
    var cart3 = Cartesian3.fromDegrees(linePos[i].X, linePos[i].Y, 30);
    this.viewer.entities.add({
      position: cart3,
      billboard: {
        image: facilityUrl,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
      },
    });
  }
}

function _updateSensors(viewer, sensorList) {
  for (let p of bus_pois) {
    viewer.entities.remove(p);
  }

  for (let l of bus_lables) {
    viewer.entities.remove(l);
  }

  for (let i of sensorList) {
    //console.log(i.serno);

    let busInfo = i.busInfo;
    let sensorInfo = i.sensorInfo;

    var cart3 = Cartesian3.fromDegrees(sensorInfo.lon, sensorInfo.lat, 30);    

    let poi = viewer.entities.add({
      position: cart3,
      billboard: {
        image: bus_icon,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
      },
      label: {
      text: busInfo.routeNum.toString(),
      font: "14pt 굴림",
      style: LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: VerticalOrigin.BOTTOM,
      pixelOffset: new Cartesian2(0, -40),
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      fillColor : Color.RED
      },
    });
    bus_pois.push(poi);
  }
}


const MapControlled = styled.div`
  position: fixed;
  z-index: 9;
  right: 24px;
  bottom: 24px;
  border-radius: 4px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
  width: 48px;
  button {
    width: 48px;
    height: 48px;
    outline: none;
    border: none;
    background-color: #fff;
    ${(props) => props.theme.layout.flexColCenter}
    img {
      width: 24px;
      height: 24px;
    }
  }
`;

/////////// 컴포넌트 스타일////////////////////
const SelectorProps = { isSelected: Boolean };
const MapStyleSelector = styled("div", SelectorProps)`
  position: fixed;
  z-index: 9;
  display: flex;
  width: ${(props) =>
    `${props.isSelected ? `calc(56px * 3)` : `calc(56px * 1)`}`};
  height: 56px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
  left: 124px;
  bottom: 180px;
  border-radius: 4px;
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  button {
    width: 56px;
    height: 56px;
    outline: none;
    border: none;
    background-color: #fff;
    position: relative;
    ${(props) => props.theme.layout.flexColCenter}
    img {
      width: 24px;
      height: 24px;
      margin-bottom: 16px;
    }
    span {
      ${(props) => props.theme.type.size.caption2};
      ${(props) => props.theme.type.weight.prd.medium};
      color: ${(props) => props.theme.color.ui.midle2};
      width: 100%;
      text-align: center;
      position: absolute;
      left: 0;
      bottom: 8px;
    }
  }
`;
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: calc(56px * 3);
  height: 56px;
`;

const ButtonProps = { bg: String };
const ButtonMap = styled("button", ButtonProps)`
  position: relative;
  width: 56px;
  height: 56px;
  outline: none;
  border: none;
  color: #fff;
  ${(props) => props.theme.layout.flexColCenter}
  background-image: ${(props) => `url(${props.bg})`};
  background-size: cover;
  background-position: center;
  ${(props) => props.theme.type.size.caption2};
  ${(props) => props.theme.type.weight.prd.bold};
  text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
  span {
    z-index: 9;
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 8px;
  }
  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.24);
  }
`;
///////////////////////////////////////////

export default {
  name: "MapCanvas",
  components: {
    Container,
    MapControlled,
    MapStyleSelector,
    ButtonMap,
    Wrapper,
  },
  props: ["sensorList"],
  data: function () {
    return {
      viewer: null, // Cesium Viewer 객체
      cesiumAccessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMjkyMTM3YS1iM2JjLTQzNWQtOTkyNi00N2JhNDI3YTQ2YmUiLCJpZCI6NzM1NzgsImlhdCI6MTYzNzA0NDk4MX0.FErgsstOfS-ML_MJ7vdPcHCdnIV6160YcbyrtEcEWZg",
      map_bg_dummy_mono,
      map_bg_dummy_satellite,
      ic_refresh,
      ic_zoom_in,
      ic_zoom_out,
      ic_map_layer,
      img_map_style_mono,
      img_map_style_satellite,
      isMapStylerSelected: false,
      currentMapStyle: "mono", // 'monoe' || 'satellite'
    };
  },

  methods: {
    updateSensors(sensorList) {
      _updateSensors(this.viewer, sensorList);
    },
  },

  created() {
    console.log("Map created.");
    //console.log(bus_route);
  },

  mounted() {
    console.log("Map mounted.");
    // let x = bus_route["features"][0]['geometry']['coordinates'][0][0];
    // console.log(x);
    // let y = bus_route["features"][0]['geometry']['coordinates'][0][1];
    // console.log(y);

    Ion.defaultAccessToken = this.cesiumAccessToken;
    Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      126.725305,
      37.433627,
      127.249917,
      37.660199
    );
    Camera.DEFAULT_VIEW_FACTOR = 0.05;

    // Cesium Viewer 초기화
    this.viewer = new Viewer("cesiumContainer", {
      selectionIndicator: false,
      fullscreenButton: false,
      geocoder: false,
      infoBox: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      animation: true,
      // 세슘 Ion 지형 사용시
      terrainProvider: createWorldTerrain(),
    });

    //건물 사용
    this.viewer.scene.primitives.add(createOsmBuildings());
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    //this.viewer.scene.primitives.add(Cesium.createOsmBuildings());
    this.viewer.scene.canvas.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
        const mousePosition = new Cartesian2(event.clientX, event.clientY);
        const selectedLocation = this.viewer.scene.pickPosition(mousePosition);

        setMarkerInPos(
          Cartographic.fromCartesian(selectedLocation),
          this.viewer
        );
      },
      false
    );

    var bing = new BingMapsImageryProvider({
      url: "https://dev.virtualearth.net",
      key: "AjhqDX7x10Y9EX1gBMws-BRTsMeUPFCQMXeWX_E98t59G2dV8Bj_xagMzsP7IHAr",
      mapStyle: BingMapsStyle.ROAD_ON_DEMAND,
    });

    // var layers = this.viewer.scene.imageryLayers;
    // layers.addImageryProvider(bing);

    // const me = this;

    var osm = new OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
      defaultGamma: 0.5,
    });

    var layers = this.viewer.scene.imageryLayers;
    var layer = layers.addImageryProvider(bing);
    layer.saturation = 0.1;

    this.viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(128.6179544895279, 35.836, 1000),
      orientation: {
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-15.0),
      },
    });

    let source = new proj4.Proj("EPSG:5187");
    let dest = new proj4.Proj("EPSG:4326");

    let features = bus_route["features"];

    console.log(features);

    for (let i = 0; i < features.length; i++) {
      let bus_line_pos = [];
      let feature = features[i];

      let j = 0;

      for (j = 0; j < feature["geometry"]["coordinates"][0].length; j++) {
        let co = feature["geometry"]["coordinates"][0][j];

        let p = { x: co[0], y: co[1] };

        var pt = proj4.toPoint(co[0], co[1]); //포인트 생성

        let result = proj4(source, dest, p);

        let cart3 = Cartesian3.fromDegrees(result.x, result.y);
        bus_line_pos.push(cart3);
      }

      if (bus_line_pos.length > 1) {
        //console.log(bus_line_pos);
        let colorHsl = Color.fromHsl(Math.random() * 0.3, 0.8, 0.5, 0.8);
        let bus_line = this.viewer.entities.add({
          name: "Green line",
          polyline: {
            positions: bus_line_pos,
            width: 10,
            material: colorHsl,
            clampToGround: true,
          },
        });
      }
    }
  },

  beforeDestroy() {
    console.log("Map destroying..");
    if (this.viewer != null) {
      this.viewer.destroy();
    }
  },
};


</script>

<style src="@/assets/cesium/Widgets/widgets.css"></style>

<style>
#cesiumContainer {
  height: 100vh;
  margin-left: 100px;
  overflow: hidden;
  position: relative;
}
.cesium-viewer {
  width: 100%;
  height: 100%;
  position: absolute !important;
}
</style>
