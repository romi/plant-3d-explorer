import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";
import { FormattedMessage } from "react-intl";

import {
  useSelectedAngle,
  useColor,
  useDefaultColors,
  usePointCloudZoom,
  usePointCloudSize
} from "flow/interactions/accessors";
import { useLayerTools, useLayers, } from "flow/settings/accessors";
import { useSegmentedPointCloud } from "flow/scans/accessors";

import { PaintIcon } from "Viewer/Interactors/icons";
import { ResetButton } from "rd/UI/Buttons";
import { H3 } from "common/styles/UI/Text/titles";
import ToolButton, { tools } from "Viewer/Interactors/Tools";
import MenuBox, { MenuBoxContent } from "rd/UI/MenuBox";
import Slider from "rd/UI/Slider";

const hex2RGB = (hex) => {
  return {
    r: parseInt(hex[1] + hex[2], 16),
    g: parseInt(hex[3] + hex[4], 16),
    b: parseInt(hex[5] + hex[6], 16),
  };
};

export const Container = styled.div({
  position: "absolute",
  top: 60,
  left: 20,
  display: "flex",

  "& :first-of-type > div": {
    borderRadius: "2px 0 0 2px",
  },

  "& :last-of-type > div": {
    borderRadius: "0 2px 2px 0",
  },
});

const LegendContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const ColumnContainer = styled.div({}, (props) => {
  return {
    display: "flex",
    visibility: props.displayed ? "visible" : "hidden",
    flexDirection: "column",
    marginLeft: 0,
    marginRight: 0,
  };
});

const ToolContainer = styled(Container)({});

// Setting the default color values to make sure every component has a base color value in addition to the one given in their file
let defaults = {
  defaultOrgan1Color: "#BD10E0",
  defaultOrgan2Color: "#E79DF6",
  defaultOrganOpacity: "0.5",
  defaultMeshColor: "#96c0a7",
  defaultMeshOpacity: "0.5",
  defaultPointCloudColor: "#f8de96",
  defaultPointCloudOpacity: "1",
  defaultPointCloudSize: "1000",
  defaultSkeletonColor: "#D0021B",
  defaultSkeletonOpacity: "0.7",
};

for (let key in defaults) {
  if (!window.localStorage.getItem(key)) {
    window.localStorage.setItem(key, defaults[key]);
  }
}

export default function MiscInteractors() {
  const [selectedAngle] = useSelectedAngle();
  const [colors, setColors] = useColor();
  const [resetDefaultColor] = useDefaultColors();
  const [layerTools] = useLayerTools();
  const [layers] = useLayers();
  const [labels, setLabels] = useState();
  const [, segmentation] = useSegmentedPointCloud();
  const [legendPicker, setLegendPicker] = useState();
  const [pointCloudZoom, setPointCloudZoom] = usePointCloudZoom();
  const [pointCloudSize, setPointCloudSize] = usePointCloudSize();

  useEffect(() => {
    if (segmentation && segmentation.labels) {
      setLabels(
        segmentation.labels.filter(
          (value, index, self) => self.indexOf(value) === index
        )
      );
    }
  }, [segmentation]);
  
  // This is probably the worst part of the interface. This is the row of tools appearing when you click on various layers.
  // There is no links between the layer buttons and the tools associated to it. 
  // Improvement : Rework the interactors to have tools associated to specific layers. Its mostly the component hierarchy with some CSS
  // most of what's done is working fine
  return (
    <ToolContainer>
      <ColumnContainer displayed={layers.mesh}>
        <ToolButton
          toolsList={useLayerTools()}
          tool={tools.colorPickers.mesh}
          layer={layers.mesh}
          interactor={{
            isButton: true,
          }}
          tooltipId="tooltip-mesh-color-picker"
          icon={
            <PaintIcon
              isActivated={layerTools.activeTool === tools.colorPickers.mesh}
            />
          }
        >
          <SketchPicker
            onChange={(color) => {
              if (color.hex === "transparent") return;
              setColors({
                ...colors,
                mesh: { rgb: color.hex, a: color.rgb.a },
              });
              window.localStorage.setItem("defaultMeshColor", color.hex);
              window.localStorage.setItem(
                "defaultMeshOpacity",
                color.rgb.a.toString()
              );
            }}
            // color={{ ...hex2RGB(colors.mesh.rgb), a: colors.mesh.a }}
            color={{
              ...hex2RGB(window.localStorage.getItem("defaultMeshColor")),
              a: window.localStorage.getItem("defaultMeshOpacity"),
            }}
          />
          <ResetButton
            onClick={() => {
              window.localStorage.setItem(
                "defaultMeshColor",
                defaults.defaultMeshColor
              );
              window.localStorage.setItem(
                "defaultMeshOpacity",
                defaults.defaultMeshOpacity
              );
              resetDefaultColor("mesh");
            }}
          />
        </ToolButton>
      </ColumnContainer>
      <ColumnContainer displayed={layers.pointCloud}>
        <ToolButton
          toolsList={useLayerTools()}
          tool={tools.colorPickers.pointCloud}
          layer={layers.pointCloud}
          interactor={{
            isButton: true,
          }}
          tooltipId={"tooltip-point-cloud-color-picker"}
          icon={
            <PaintIcon
              isActivated={
                layerTools.activeTool === tools.colorPickers.pointCloud
              }
            />
          }
        >
          <SketchPicker
            onChange={(color) => {
              if (color.hex === "transparent") return;
              setColors({
                ...colors,
                pointCloud: { rgb: color.hex, a: color.rgb.a },
              });
              window.localStorage.setItem("defaultPointCloudColor", color.hex);
              window.localStorage.setItem(
                "defaultPointCloudOpacity",
                color.rgb.a.toString()
              );
            }}
            // color={{ ...hex2RGB(colors.pointCloud.rgb), a: colors.pointCloud.a }}
            color={{
              ...hex2RGB(window.localStorage.getItem("defaultPointCloudColor")),
              a: window.localStorage.getItem("defaultPointCloudOpacity"),
            }}
          />
          <ResetButton
            onClick={() => {
              resetDefaultColor("pointCloud");
              window.localStorage.setItem(
                "defaultPointCloudColor",
                defaults.defaultPointCloudColor
              );
              window.localStorage.setItem(
                "defaultPointCloudOpacity",
                defaults.defaultPointCloudOpacity
              );
            }}
          />
        </ToolButton>
      </ColumnContainer>
      <ColumnContainer displayed={layers.segmentedPointCloud}>
        <ToolButton
          toolsList={useLayerTools()}
          tool={tools.colorPickers.segmentedPointCloud}
          layer={layers.segmentedPointCloud}
          Interactor={{
            isButton: true,
          }}
          tooltipId={"tooltip-segmentedpointcloud-color-picker"}
          icon={
            <PaintIcon
              isActivated={
                layerTools.activeTool === tools.colorPickers.segmentedPointCloud
              }
            />
          }
        >
          {labels && colors.segmentedPointCloud.length
            ? labels.map((d, i) => {
                return (
                  <LegendContainer key={d}>
                    <H3 style={{ fontSize: 13 }}> {d} </H3>
                    <MenuBox
                      activate={legendPicker === i}
                      onClose={() => {
                        setLegendPicker(null);
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          marginLeft: 10,
                          backgroundColor: colors.segmentedPointCloud[i],
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setLegendPicker(i);
                        }}
                      />
                      <MenuBoxContent>
                        <SketchPicker
                          disableAlpha
                          onChange={(val) => {
                            let copy = colors.segmentedPointCloud.slice();
                            copy[i] = val.hex;
                            setColors({ ...colors, segmentedPointCloud: copy });
                            window.localStorage.setItem(
                              "defaultSegmentedColors",
                              JSON.stringify(copy)
                            );
                          }}
                          color={colors.segmentedPointCloud[i]}
                        />
                      </MenuBoxContent>
                    </MenuBox>
                  </LegendContainer>
                );
              })
            : null}
        </ToolButton>
      </ColumnContainer>
      <ColumnContainer displayed={layers.skeleton}>
        <ToolButton
          toolsList={useLayerTools()}
          tool={tools.colorPickers.skeleton}
          layer={layers.skeleton}
          interactor={{
            isButton: true,
          }}
          tooltipId={"tooltip-skeleton-color-picker"}
          icon={
            <PaintIcon
              isActivated={
                layerTools.activeTool === tools.colorPickers.skeleton
              }
            />
          }
        >
          <SketchPicker
            onChange={(color) => {
              if (color.hex === "transparent") return;
              setColors({
                ...colors,
                skeleton: { rgb: color.hex, a: color.rgb.a },
              });
              window.localStorage.setItem("defaultSkeletonColor", color.hex);
              window.localStorage.setItem(
                "defaultSkeletonOpacity",
                color.rgb.a.toString()
              );
            }}
            // color={{ ...hex2RGB(colors.skeleton.rgb), a: colors.skeleton.a }}
            color={{
              ...hex2RGB(window.localStorage.getItem("defaultSkeletonColor")),
              a: window.localStorage.getItem("defaultSkeletonOpacity"),
            }}
          />
          <ResetButton
            onClick={() => {
              resetDefaultColor("skeleton");
              window.localStorage.setItem(
                "defaultSkeletonColor",
                defaults.defaultSkeletonColor
              );
              window.localStorage.setItem(
                "defaultSkeletonOpacity",
                defaults.defaultSkeletonOpacity
              );
            }}
          />
        </ToolButton>
      </ColumnContainer>
      <ColumnContainer displayed={layers.angles}>
        <ToolButton
          toolsList={useLayerTools()}
          tool={tools.colorPickers.organs}
          layer={layers.angles}
          interactor={{
            isButton: true,
          }}
          tooltipId={
            selectedAngle === undefined || selectedAngle === null
              ? "tooltip-organ-global-color-picker"
              : "tooltip-organ-color-picker"
          }
          icon={
            <PaintIcon
              isActivated={layerTools.activeTool === tools.colorPickers.organs}
            />
          }
        >
          <SketchPicker
            onChange={(color) => {
              if (color.hex === "transparent") return;
              let color2 = color.hsl;
              // Use a lighter color for the second organ of the pair
              color2.l += 0.3;
              /* This is a bit ugly but very useful to change the brightness of
               the color */
              const color2String =
                "hsl(" +
                Math.round(color2.h) +
                ", " +
                Math.round(color2.s * 100) +
                "%, " +
                Math.round(color2.l * 100) +
                "%)";
              if (selectedAngle !== undefined && selectedAngle !== null) {
                // We slice the array because it has to be an immutable change
                let copy = colors.organs.slice();
                const next = selectedAngle + 1;
                copy[selectedAngle] = { rgb: color.hex, a: color.rgb.a };
                copy[next] = { rgb: color2String, a: color.rgb.a };
                setColors({
                  ...colors,
                  organs: copy,
                });
              } else {
                setColors({
                  ...colors,
                  globalOrganColors: [
                    { rgb: color.hex, a: color.rgb.a },
                    { rgb: color2String, a: color.rgb.a },
                  ],
                });
              }
              window.localStorage.setItem("defaultOrgan1Color", color.hex);
              window.localStorage.setItem("defaultOrgan2Color", color2String);
              window.localStorage.setItem(
                "defaultOrganOpacity",
                color.rgb.a.toString()
              );
            }}
            color={
              selectedAngle !== undefined &&
              selectedAngle !== null &&
              colors.organs[selectedAngle]
                ? {
                    ...hex2RGB(
                      window.localStorage.getItem("defaultOrgan1Color")
                    ), // hex2RGB(colors.organs[selectedAngle].rgb)
                    a: window.localStorage.getItem("defaultOrganOpacity"),
                  }
                : {
                    ...hex2RGB(
                      window.localStorage.getItem("defaultOrgan1Color")
                    ), // hex2RGB(colors.organs[0].rgb)
                    a: window.localStorage.getItem("defaultOrganOpacity"),
                  }
            }
          />
          <ResetButton
            onClick={() => {
              if (selectedAngle !== undefined && selectedAngle !== null) {
                if (colors.organs.length > selectedAngle + 1) {
                  let copy = colors.organs.slice();
                  copy[selectedAngle] = null;
                  copy[selectedAngle + 1] = null;
                  setColors({
                    ...colors,
                    organs: copy,
                  });
                }
              } else {
                window.localStorage.setItem(
                  "defaultOrgan1Color",
                  defaults.defaultOrgan1Color
                );
                window.localStorage.setItem(
                  "defaultOrgan2Color",
                  defaults.defaultOrgan2Color
                );
                window.localStorage.setItem(
                  "defaultOrganOpacity",
                  defaults.defaultOrganOpacity
                );
                resetDefaultColor("globalOrganColors");
              }
            }}
          />
        </ToolButton>
      </ColumnContainer>

      <ColumnContainer
        style={{ marginTop: -9, marginLeft: 10 }}
        displayed={
          layers.segmentedPointCloud ||
          layers.pointCloud ||
          layers.pointCloudGroundTruth
        }
      >
        <H3 style={{ backgroundColor: "white", padding: 7.5 }}>
          <FormattedMessage id="pointcloud-zoom" />
        </H3>
        <Slider
          min={1}
          max={4}
          default={2}
          step={0.1}
          callback={(value) =>
            setPointCloudZoom({ ...pointCloudZoom, level: value })
          }
        />
      </ColumnContainer>
      <ColumnContainer
        style={{ marginTop: -9, marginLeft: 10 }}
        displayed={
          layers.segmentedPointCloud ||
          layers.pointCloud ||
          layers.pointCloudGroundTruth
        }
      >
        <H3 style={{ backgroundColor: "white", padding: 7.5 }}>
          <FormattedMessage id="pointcloud-size" />
        </H3>
        <Slider
          min={0.01}
          max={1}
          default={0.75}
          step={0.01}
          callback={(value) =>
            setPointCloudSize({ ...pointCloudSize, sampleSize: value })
          }
        />
      </ColumnContainer>
    </ToolContainer>
  );
}
