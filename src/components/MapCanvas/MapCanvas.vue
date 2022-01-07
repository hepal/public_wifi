<template>
  <div>
    <div id="cesiumContainer"></div>
    <cesium-compass id="compass"></cesium-compass>
    <Container
      :bg="
        currentMapStyle === 'mono' ? map_bg_dummy_mono : map_bg_dummy_satellite
      "
    >
      <!-- Information -->
      <BusEntity
        v-for="(bus, index) in busDataDummy"
        :key="index"
        :number="bus.number"
        :x="bus.location.x"
        :y="bus.location.y"
      />
      <LocationInfoEntity
        ref="locationInfo"
        v-for="(location, index) in locationInfoDataDummy"
        :key="index"
        :title="location.title"
        :locationName="location.locationName"
        :dust="location.dust"
        :no2="location.no2"
        :o3="location.o3"
        :temperature="location.temperature"
        :humid="location.humid"
        :x="location.location.x"
        :y="location.location.y"
      />
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
              updateMapLayer(currentMapStyle);
            "
          >
            <span>모노크롬</span>
          </ButtonMap>
          <ButtonMap
            :bg="img_map_style_satellite"
            v-on:click="
              isMapStylerSelected = !isMapStylerSelected;
              currentMapStyle = 'satellite';
              updateMapLayer(currentMapStyle);
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
  destroyObject,
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
  SceneTransforms,
} from "cesium";

import "@geoblocks/cesium-compass";
import Container from "./Container";
import LocationInfoEntity from "@/components/LocationInfoEntity/LocationInfoEntity";
import BusEntity from "@/components/BustEntity/BusEntity";

// 맵 영역 표시용 더미 이미지
import map_bg_dummy from "../../assets/dummy/map_bg_mono.jpg";
import styled from "vue-styled-components";
import bus_route from "../../assets/route/BUS_ALL_12_09.json";
import route_cell from "../../assets/route/cell_route_50.json";
import bus_num_link_id from "../../assets/route/bus_num_link_id.json";
import proj4 from "proj4/dist/proj4";
import HashMap from "hashmap";
//import axios from "axios";

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

var busRouteMap = new HashMap();

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
//버스 정보 리스트
var bus_infos = []; //버스 정보
var bus_locations = []; //버스 위치 정보
var bus_sensor_infos = []; //버스 센서 정보

var cesiumViewer = null;
var facilityUrl = "./images/bus.png";

//var route_file_name = "./Assets/Routes/bus_route_sensor_15.json";

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

//var currentSensorList = null;
function _updateMapLayer(viewer, currentMapStyle) {
  let layers = viewer.scene.imageryLayers;
  let baseLayer = layers.get(0);

  if (currentMapStyle == "mono") {
    let osm = new OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
      defaultGamma: 0.5,
    });
    layers.remove(baseLayer);
    let layer = layers.addImageryProvider(osm);
    layer.saturation = 0.1;
  } else {
    let bing = new BingMapsImageryProvider({
      url: "https://dev.virtualearth.net",
      key: "AjhqDX7x10Y9EX1gBMws-BRTsMeUPFCQMXeWX_E98t59G2dV8Bj_xagMzsP7IHAr",
      mapStyle: BingMapsStyle.AERIAL,
    });

    layers.remove(baseLayer);
    let layer = layers.addImageryProvider(bing);
  }
}

function _updateSensors(viewer, sensorList) {
  bus_infos = [];
  bus_locations = [];
  bus_sensor_infos = [];

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
      name: busInfo.busNum,
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
        fillColor: Color.RED,
      },
    });
    bus_pois.push(poi);
    bus_infos.push(busInfo);
    bus_locations.push(cart3);
    bus_sensor_infos.push(sensorInfo);
    //let screenPos = SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cart3);
  }
}

var cellRouteMap = new HashMap();

//속도 측정용 함수
var startTime, endTime;

function startTimer() {
  startTime = new Date();
}

function endTimer() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff);
  console.log(timeDiff + " seconds");
}

function createCellRouteMap() {
  for (let r of route_cell["cell_list"]) {
    let cellId = r["id"];

    let routeList = [];
    for (let l of r["route_ids"]) {
      routeList.push(l);
    }

    cellRouteMap.set(cellId, routeList);
  }
}

function getRoute() {

}



//버스 경로의 색상 (오염도)를 업데이트 한다.
async function _updateRouteInfo(viewer, totalSensorList) {
  startTimer();
  let dest = new proj4.Proj("EPSG:5187"); //기존 버스 경로 좌표계
  let source = new proj4.Proj("EPSG:4326"); //위경도 좌표계

  let cellStep = route_cell["cell_step"];
  let cellSize = route_cell["cell_size"];
  let boundLeft = route_cell["bound_left"];
  let boundBottom = route_cell["bound_bottom"];

  //초기화
  for (const pair of busRouteMap) {
    pair.value.name = "0";
  }

  if (null != totalSensorList) {
    let minValue = 1000000;
    let maxValue = -1000000;

    let tempTotalValueMap = new HashMap();
    let tempTotalValueCountMap = new HashMap();

    for (let sensor of totalSensorList) {
      let p = { x: sensor.lon, y: sensor.lat };
      let result = proj4(source, dest, p); //버스 경로 좌표계로 변환

      let stepX = Math.floor((result.x - boundLeft) / cellStep);
      let stepY = Math.floor((result.y - boundBottom) / cellStep);

      let cellId = stepY * cellSize + stepX;

      if (cellRouteMap.has(cellId)) {
        for (let routeId of cellRouteMap.get(cellId)) { //cellID를 가지고 route ID list를 가져온다.
          //route number
          if (busRouteMap.has(routeId)) {
            let value = sensor[activeSensorType]; //현재 sensorType 값을 가져온다.

            if (!tempTotalValueMap.has(routeId)) {
              tempTotalValueMap.set(routeId, value);
              tempTotalValueCountMap.set(routeId, 1);
            } else {
              tempTotalValueMap.set(
                routeId,
                tempTotalValueMap.get(routeId) + value
              );
              tempTotalValueCountMap.set(
                routeId,
                tempTotalValueCountMap.get(routeId) + 1
              );
            }            
          }
        }
      }
    }

    currentRouteColorMap.clear();
    //update line color
    for (const pair of busRouteMap) {
      if (tempTotalValueMap.has(pair.key)) {
        let totalValue = tempTotalValueMap.get(pair.key);
        let value = totalValue / tempTotalValueCountMap.get(pair.key);

        //let value = parseFloat(pair.value.name);

        let hue = 0;
        switch (activeSensorType) {
          case "pm2_5":
            hue = Math.max(0, ((75 - value) / 75) * 0.666667); //(0~240)도
            break;
          case "o3":
            value = value / 1000; //o3도 1/1000 로 줄임
            hue = Math.max(0, ((0.2 - value) / 0.2) * 0.666667); //(0~240)도
            break;
          case "no2":
            value = value / 1000; //이산화질소는 1/1000 로 줄임
            hue = Math.max(0, ((0.15 - value) / 0.15) * 0.666667); //(0~240)도
            break;
          case "humi":
            hue = Math.max(0, (value / 100) * 0.666667); //(0~240)도
            break;
          case "temp":
            hue = Math.max(0, ((45 - value) / 65) * 0.666667); //(0~240)도
            break;
        }

        if (isNaN(hue)) {
          console.log("value:" + value + " totalValue" + totalValue);
        }

        let color = Color.fromHsl(hue, 0.8, 0.5, 0.5);

        currentRouteColorMap.set(pair.key,color);
        pair.value.polyline.material = color;
      }
    }

    console.log("route color updated");
    endTimer();

    return "route color updated";
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
  @media only screen and (max-width: 480px) {
    right: 12px;
    bottom: 148px;
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
  @media only screen and (max-width: 480px) {
    left: 12px;
    bottom: 148px;
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

var mapBusNumLinkId = new HashMap();
var currentRouteColorMap = new HashMap();

function changeRouteColorExceptBusRoute(busNum,color) {
  if(mapBusNumLinkId.has(busNum)) {
    let linkIdList = mapBusNumLinkId.get(busNum);    

    for (const pair of busRouteMap) {
      pair.value.polyline.material.color = color;
    }

    for(let l of linkIdList) {
      let lst = l.toString();
      if(currentRouteColorMap.has(lst) && busRouteMap.has(lst)) {    
        busRouteMap.get(lst).polyline.material.color = currentRouteColorMap.get(lst);
      } 
    }
  }
}

function initBusNumLinkIdMap() {
  for(let b of bus_num_link_id) {
    if(!mapBusNumLinkId.has(b.ROUTE_NO)) {
      mapBusNumLinkId.set(b.ROUTE_NO, new Array());
    }     

    mapBusNumLinkId.get(b.ROUTE_NO).push(b.LINK_ID);
  }
}

function createBusRoute(viewer) {
  let source = new proj4.Proj("EPSG:5187"); //기존 버스 경로 좌표계
  let dest = new proj4.Proj("EPSG:4326"); //위경도 좌표계

  let features = bus_route["features"];

  console.log(features);

  for (let i = 0; i < features.length; i++) {
    let bus_line_pos = [];
    let feature = features[i];

    let id = feature["properties"]["link_id"];

    let j = 0;

    for (j = 0; j < feature["geometry"]["coordinates"][0].length; j++) {
      let co = feature["geometry"]["coordinates"][0][j];

      let p = { x: co[0], y: co[1] };

      //var pt = proj4.toPoint(co[0], co[1]); //포인트 생성

      let result = proj4(source, dest, p); //위경도로 변환

      let cart3 = Cartesian3.fromDegrees(result.x, result.y);
      bus_line_pos.push(cart3);
    }

    if (bus_line_pos.length > 1) {
      //let colorHsl = Color.fromHsl(Math.random() * 0.3, 0.8, 0.5, 0.8);
      let bus_line = viewer.entities.add({
        name: "0", //value로 사용함
        polyline: {
          positions: bus_line_pos,
          width: 10,
          material: Color.PURPLE,
          clampToGround: true,
        },
      });

      busRouteMap.set(id, bus_line);
    }
  }
}

function device_check() {
  // 디바이스 종류 설정
  let pc_device = "win16|win32|win64|mac|macintel";

  // 접속한 디바이스 환경
  let this_device =
    navigator?.userAgentData?.platform || navigator?.platform || "unknown";

  if (this_device) {
    if (pc_device.indexOf(this_device.toLowerCase()) < 0) {
      return "MOBILE";
    } else {
      return "PC";
    }
  }
}

var activeSensorType = "pm2_5";
var component = null;
//var osm = null;
//var bing = null;
var locationInfoData = [];
var locationInfoControl = null;
///////////////////////////////////////////

export default {
  name: "MapCanvas",
  components: {
    Container,
    MapControlled,
    MapStyleSelector,
    ButtonMap,
    Wrapper,
    LocationInfoEntity,
    BusEntity,
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
      currentMapStyle: "mono", // 'monoe' || 'satellite',
      busDataDummy: [
        // {
        //   number: 523,
        //   location: {
        //     x: 400,
        //     y: 340,
        //   },
        // },
        // {
        //   number: 523,
        //   location: {
        //     x: 600,
        //     y: 540,
        //   },
        // },
        // {
        //   number: 523,
        //   location: {
        //     x: 250,
        //     y: 580,
        //   },
        // },
      ],
      locationInfoDataDummy: [
        {
          locationName: "대구광역시 OOO동",
          dust: 0.001,
          no2: 0.012,
          o3: 0.01,
          temperature: 34,
          humid: 65,
          location: {
            x: 500,
            y: 240,
          },
        },
      ],
    };
  },
  methods: {
    updateMapLayer(currentMapStyle) {
      _updateMapLayer(this.viewer, currentMapStyle);
    },
    updateSensors(activeSensorList) {
      _updateSensors(this.viewer, activeSensorList);
    },
    async updateRoute(totalSensorList) {
      let result = await _updateRouteInfo(this.viewer, totalSensorList);
    },
    setActiveSensor(sensorType) {
      activeSensorType = sensorType;
      console.log("active sensor:" + activeSensorType);
    },
  },

  created() {
    console.log("Map created.");
    //console.log(bus_route);
  },

  mounted() {
    component = this;
    console.log("Map mounted.");

    var device = device_check();

    // let x = bus_route["features"][0]['geometry']['coordinates'][0][0];
    // console.log(x);
    // let y = bus_route["features"][0]['geometry']['coordinates'][0][1];
    // console.log(y);

    locationInfoData = this.locationInfoDataDummy;
    locationInfoControl = this.$refs.locationInfo;
    Ion.defaultAccessToken = this.cesiumAccessToken;
    Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      126.725305,
      37.433627,
      127.249917,
      37.660199
    );
    Camera.DEFAULT_VIEW_FACTOR = 0.05;

    // Cesium Viewer 초기화
    if (this.$viewer != null) {
      this.viewer = this.$viewer;
      return;
    }
    this.viewer = new Viewer("cesiumContainer", {
      selectionIndicator: false,
      fullscreenButton: false,
      geocoder: false,
      infoBox: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: true,
      baseLayerPicker: false,
      homeButton: false,
      sceneModePicker: false,
      animation: false,
      // 세슘 Ion 지형 사용시
      //terrainProvider: createWorldTerrain(),
      terrainProvider: device == "PC" ? createWorldTerrain() : null,
    });

    cesiumViewer = this.viewer;
    this.$viewer = this.viewer;

    //건물 사용
    if ("PC" == device) {
      this.viewer.scene.primitives.add(createOsmBuildings());
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
    }

    this.viewer.selectedEntityChanged.addEventListener(function (
      selectedEntity
    ) {
      if (CesiumDefined(selectedEntity)) {
        if (CesiumDefined(selectedEntity.name)) {
          console.log("Selected " + selectedEntity.name);

          //let device = device_check();

          let counter = 0;
          for (let b of bus_infos) {
            if (b.busNum == selectedEntity.name) {
              console.log(b);

              let cart2 = SceneTransforms.wgs84ToWindowCoordinates(
                cesiumViewer.scene,
                bus_locations[counter]
              );

              let cartographic = Cartographic.fromCartesian(
                bus_locations[counter]
              );

              let lon = CesiumMath.toDegrees(cartographic.longitude);
              let lat = CesiumMath.toDegrees(cartographic.latitude);

              let post =
                "http://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=" +
                lon +
                "," +
                lat +
                "&type=both&zipcode=true&simple=true&key=D757F8D1-B108-3924-86E7-2DA8B1A288FF"; //만료일 2022-03-09  

              component.$jsonp(post).then(function (response) {
                if (response.status == 200) {
                  console.log(response);
                }

                //행정동 가져오기
                //0은 구주소, 1은 도로명 주소
                let dong = response.response.result[0].structure.level4L;

                let sensorInfo = bus_sensor_infos[counter];

                locationInfoData[0].locationName = dong;
                locationInfoData[0].dust = sensorInfo.pm2_5;
                locationInfoData[0].no2 = roundToTwo(sensorInfo.no2 / 1000.0); // 1/1000
                locationInfoData[0].o3 = roundToTwo(sensorInfo.o3 / 1000.0); // 1/1000
                locationInfoData[0].temperature = sensorInfo.temp;
                locationInfoData[0].humid = sensorInfo.humi;
                if ("PC" == device) {
                  locationInfoData[0].location.x = cart2.x - 20;
                } else {
                  locationInfoData[0].location.x = cart2.x - 20;
                }

                locationInfoData[0].location.y = cart2.y - 60;
              });

              //선택된 버스의 노선만 표시
              let color = Color.fromRgba(0x80808080);
              changeRouteColorExceptBusRoute(b.routeNum,color);
              break;
            }

            counter++;
          }
        } else {
          console.log("Unknown entity selected.");
        }
      } else {
        console.log("Deselected.");
        locationInfoData[0].location.x = -1000;
        locationInfoData[0].location.y = -1000;
      }
    });

    let osm = new OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
      defaultGamma: 0.5,
    });

    var layers = this.viewer.scene.imageryLayers;
    var layer = layers.addImageryProvider(osm);
    layer.saturation = 0.1;

    this.viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(128.6179544895279, 35.836, 1000),
      orientation: {
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-15.0),
      },
    });

    const compass = document.querySelector("cesium-compass");
    compass.scene = this.viewer.scene;
    compass.clock = this.viewer.clock;

    initBusNumLinkIdMap();
    createBusRoute(this.viewer);
    createCellRouteMap();

    //pc와 mobile의 compass 위치를 다르게 한다.
    //let device = device_check();

    if ("PC" == device) {
      let compass = document.getElementById("compass");

      compass.style.top = "80px";
    }

    // var handler = new ScreenSpaceEventHandler(cesiumViewer.scene.canvas);

    // handler.setInputAction(function (movement) {
    //   // for(let p of bus_positions) {
    //   //   console.log(SceneTransforms.wgs84ToWindowCoordinates(cesiumViewer.scene, p));
    //   // }
    // }, ScreenSpaceEventType.MOUSE_MOVE);
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
  overflow: hidden;
  position: relative;
  @media (hover: hover) and (pointer: fine) {
    margin-left: 100px;
  }
}
.cesium-viewer {
  width: 100%;
  height: 100%;
  position: absolute !important;
}

cesium-compass {
  position: absolute;
  right: 0px;
  top: 20px;
  --cesium-compass-stroke-color: rgba(0, 0, 0, 0.6);
  --cesium-compass-fill-color: rgb(224, 225, 226);
}
</style>
