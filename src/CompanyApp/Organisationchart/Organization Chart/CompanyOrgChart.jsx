 import React, { useState, useRef, useEffect } from "react";
 import ReactDOMServer from "react-dom/server";
 import { OrgChart } from "d3-org-chart";
 import { FaAngleUp, FaAngleDown } from "react-icons/fa";
 import { Button } from "antd";
import CompanyLogo from "./CompanyLogo";

 const CompanyOrganizationalChart = (props) => {
     const d3Container = useRef(null);
     const [selectedNode, setSelectedNode] = useState(null);
     const [defaultTransform, setDefaultTransform] = useState('translate(353.4512533315144,13.83529010503787) scale(0.6108495036238286)');

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
                 if (props.setChartRef && d3Container.current) {
                    const internalChartContainer = d3Container.current.querySelector('.center-group');
                    props.setChartRef(internalChartContainer || d3Container.current);
                  }
             chart.expandAll();
         }

         if (props.setChartRef && d3Container.current) {
             props.setChartRef(d3Container.current);
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
            <div ref={d3Container}  className="orgChart"  style={{  width: '100%',  height: '600px'}}>
            </div>
        </>
     );
 };

 const CustomNodeContent = ({ data }) => {
     return (
         <div className="nodeContainer">
             <div className="nodeDetails">
                 <div className="nodeContent">
                        <CompanyLogo photoPath={data.logo} id={data.id}></CompanyLogo>
                         <div className="nodeInfo">
                         <div className="nodeName">
                             {data.name}
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     );
 };
 const getTotalDescendantCount = (node) => {
     if (!node.children || node.children.length === 0) {
         return 0;
     }
     return node.children.reduce((total, child) => total + getTotalDescendantCount(child) + 1, 0);
 };

 const CustomExpandButton = (node) => {
     const totalDescendantCount = getTotalDescendantCount(node);
     return (
         <div className="expandBtn">
             <span>{totalDescendantCount}</span>
             <span className="flex">
                 {node.children && node.children.length > 0 ? <FaAngleUp /> : <FaAngleDown />}
             </span>
         </div>
     );
 };
 export default CompanyOrganizationalChart;