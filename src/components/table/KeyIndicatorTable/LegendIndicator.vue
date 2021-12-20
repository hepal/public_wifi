<template>
	<Container>
		<List v-for="(legend, index) in legendList" :key="index">
			<Title>
				<img :src="legend.img" alt="" />
				<p>{{ legend.title }}</p>
			</Title>
			<ColorScaleBar>
				<ColorRange
					v-for="(range, index) in legend.range"
					:key="index"
					:index="index"
				>
					<Level>
						{{ levelList[index] }}
					</Level>
					<Tick>
						{{ range }}
					</Tick>
				</ColorRange>
			</ColorScaleBar>
		</List>
	</Container>
</template>
<script>
import styled from "vue-styled-components";
import { TYPE, CODE, SCALE } from "../../../globalConst/indicatorCode";

// assets
import ic_dust from "../../../assets/icon/indicator/dust.svg";
import ic_no2 from "../../../assets/icon/indicator/no2.svg";
import ic_o3 from "../../../assets/icon/indicator/o3.svg";

const legendList = [
	{
		title: "초미세먼지",
		img: ic_dust,
		range: SCALE[TYPE.DUST],
	},
	{
		title: "이산화질소",
		img: ic_no2,
		range: SCALE[TYPE.NO2],
	},
	{
		title: "오존",
		img: ic_o3,
		range: SCALE[TYPE.O3],
	},
];

const levelList = ["좋음", "보통", "나쁨", "매우 나쁨"];

const Container = styled.div`
	width: 100%;
	@media only screen and (max-width: 480px) {
		padding: 0px;
		width: calc(100% - 24px);
	}
`;

const List = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	margin-bottom: 16px;
`;

const Title = styled.div`
	width: 124px;
	display: flex;
	align-items: center;
	img {
		width: 56px;
		height: 56px;
	}
	p {
		${(props) => props.theme.type.size.caption};
		${(props) => props.theme.type.weight.bold};
	}
	@media only screen and (max-width: 480px) {
		width: 108px;
		img {
			width: 32px;
			height: 32px;
		}
	}
`;

const ColorScaleBar = styled.div`
	width: calc(100% - 124px);
	height: 8px;
	display: flex;
	position: relative;
  @media only screen and (max-width: 480px) {
    	width: calc(100% - 108px);
  }
`;

const ColorRangeProps = { index: Number };

const ColorRange = styled("div", ColorRangeProps)`
	position: relative;
	width: 25%;
	background-color: ${(props) => {
		switch (props.index) {
			case 0:
				return props.theme.color.level.good;
			case 1:
				return props.theme.color.level.normal;
			case 2:
				return props.theme.color.level.bad;
			case 3:
				return props.theme.color.level.worse;
			default:
				return "none";
		}
	}};
	:before {
		position: absolute;
		content: "";
		right: -16px;
		top: 0;
		width: 32px;
		height: 100%;
		z-index: 9;
		background-image: ${(props) => {
			switch (props.index) {
				case 0:
					return `linear-gradient(to right, ${props.theme.color.level.good} , ${props.theme.color.level.normal})`;
				case 1:
					return `linear-gradient(to right, ${props.theme.color.level.normal} , ${props.theme.color.level.bad})`;
				case 2:
					return `linear-gradient(to right, ${props.theme.color.level.bad} , ${props.theme.color.level.worse})`;
				default:
					return "none";
			}
		}};
	}
`;

const Tick = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 24px;
	border-left: solid 0.5px #fff;
	padding-top: 16px;
	z-index: 9;
	${(props) => props.theme.type.size.caption};
`;

const Level = styled.div`
	position: absolute;
	top: -36px;
	left: 0;
	height: 24px;
	border-left: solid 0.5px #fff;
	padding-top: 16px;
	z-index: 9;
	${(props) => props.theme.type.size.caption};
`;

export default {
	name: "Legend",
	components: {
		Container,
		List,
		Title,
		ColorScaleBar,
		ColorRange,
		Tick,
		Level,
	},
	data() {
		return {
			TYPE,
			CODE,
			SCALE,
			legendList,
			levelList,
		};
	},
};
</script>
