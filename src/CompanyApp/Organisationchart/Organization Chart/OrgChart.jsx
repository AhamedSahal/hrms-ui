import React, { useState, useRef, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { OrgChart } from "d3-org-chart";
import { FaBuilding, FaAngleUp, FaAngleDown } from "react-icons/fa";
import EmployeeOrgChartPhoto from "./EmployeePhoto";
import { Button } from "antd";

const OrganizationalChart = (props) => {
  const d3Container = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [defaultTransform, setDefaultTransform] = useState('translate(290.1463949926509,30.465137339309734) scale(0.5)');

  useEffect(() => {
    const toggleDetailsCard = (nodeId) => {
      setSelectedNode(nodeId);
    };

    const chart = new OrgChart();

    if (props.data && d3Container.current) {
      chart
        .container(d3Container.current)
        .data(props.data)
        .nodeWidth((d) => 300)
        .nodeHeight((d) => 150)
        .compactMarginBetween((d) => 80)
        .onNodeClick((d) => {
          toggleDetailsCard(d);
        })
        .buttonContent((node, state) => {
          return ReactDOMServer.renderToStaticMarkup(
            <CustomExpandButton {...node.node} />
          );
        })
        .nodeContent((d) => {
          return ReactDOMServer.renderToStaticMarkup(
            <CustomNodeContent {...d} selected={d.id === selectedNode} />
          );
        })
        .render();
      const internalChartContainer = d3Container.current.querySelector('.center-group');
      if (internalChartContainer) {
        const currentTransform = internalChartContainer.getAttribute('transform');
        if (!currentTransform) {
          internalChartContainer.setAttribute('transform', defaultTransform);
        }
      }
      chart.expandAll();
    }

    if (props.setChartContainerRef && d3Container.current) {
      props.setChartContainerRef(d3Container.current);
    }
  }, [props, props.data, selectedNode, defaultTransform]);

  const zoomAdjust = (delta) => {
    const chartContainer = d3Container.current;

    if (chartContainer) {
      const internalChartContainer = chartContainer.querySelector('.center-group');

      if (internalChartContainer) {
        const currentTransform = internalChartContainer.getAttribute('transform');

        const match = /translate\(([^,]+),([^)]+)\) scale\(([\d.]+)\)/.exec(currentTransform);

        if (match) {
          const translateX = match[1];
          const translateY = match[2];
          const currentScale = parseFloat(match[3]);

          const newScale = Math.max(0.1, currentScale + delta);
          if (newScale <= 1) {
            internalChartContainer.setAttribute('transform', `translate(${translateX},${translateY}) scale(${newScale})`);
          }
        }
      }
    }
  };
  return (
    <>
      <div className="chart-actions" style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <Button className="zoomIn" onClick={() => zoomAdjust(0.1)}>
          <i className="fa fa-search-plus"></i> Zoom In
        </Button>
        <Button className="zoomOut" onClick={() => zoomAdjust(-0.1)}>
          <i className="fa fa-search-minus"></i> Zoom Out
        </Button>
      </div>
      <div ref={d3Container} className="orgChart" style={{ width: '100%', height: '100%' }}>
      </div>
    </>
  );
};

const CustomNodeContent = (props) => {
  return (
    <>
      <div className="nodeContainer">
        <div className="nodeDetails">
          {props.data.team === "" ? (
            <div className="nodeContent">
              <EmployeeOrgChartPhoto id={props.data.id}></EmployeeOrgChartPhoto>
              <div className="nodeInfo">
                <div className="nodeName">{props.data.name}</div>
                <div className="nodeRole">{props.data.positionName}</div>
                {props.data.department && (
                  <div className="nodeDepartment">
                    <FaBuilding className="icon" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="nodeTeam">
              {props._children !== null &&
                props._children
                  .slice(0, 4)
                  .map((child) => (
                    <></>
                  ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
const getTotalDescendantCount = (node) => {
  if (node.data.type && node.data.type == "Department" && node.data.userType == "Owner") {
    return (node.data._totalSubordinates - node.data._directSubordinates);
  }
  if (!node.children || node.children.length === 0) {
    return node.data._directSubordinates || 0;
  }

  const totalDescendantCount = node.children.reduce((total, child) => {
    return total + getTotalDescendantCount(child);
  }, 0);

  return (node.data._directSubordinates || 0) + totalDescendantCount;
};

const CustomExpandButton = (node) => {
  const totalDescendantCount = getTotalDescendantCount(node);

  return (
    <>
      {node && (
        <div className="expandBtn">
          <span>{totalDescendantCount}</span>
          <span className="flex">
            {node.children ? <FaAngleUp /> : <FaAngleDown />}
          </span>
        </div>
      )}
    </>
  );
};
export default OrganizationalChart;