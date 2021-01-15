/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2021 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

import React from 'react';
import * as d3 from "d3";
import 'd3-selection-multi';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';

let INVLIST = GlobalExtConstants.INVLIST;
let PAGINATION_CONSTANT = GlobalExtConstants.PAGINATION_CONSTANT;

/**
 * This function will create a visualization from query outputs
 * @param props
 * @returns {*}
 */
var populateGraphObject = (nodes, links, data) => {
        for(var i = 0; i < data.results.length; i++){
                        nodes[data.results[i].url] = data.results[i];
                        let nodeType = data.results[i]['node-type'];
                        nodes[data.results[i].url].weight = 1/((((data.results[i].url).split('\/')).length) - 3);
                        let splitUrl = (data.results[i].url).split(nodeType + '\/');
                        nodes[data.results[i].url].nodeTypeLabel = nodeType;
                        nodes[data.results[i].url].nodeKeyLabel  = splitUrl.pop();
                        let tempIconString = ((splitUrl.pop()).split('\/'));
                        tempIconString.pop(); //pop last off, not needed
                        let iconString = tempIconString.pop();
                        let iconKey = (iconString.replace(/-/g, '')).toUpperCase();
                        if(INVLIST.INVENTORYLIST[iconKey] && INVLIST.INVENTORYLIST[iconKey].icon){
                            nodes[data.results[i].url].icon = INVLIST.INVENTORYLIST[iconKey].icon;
                        }else{
                            nodes[data.results[i].url].icon = 'icon-datanetwork-serverL';
                        }
                        console.log("icon string: " + nodes[data.results[i].url].icon);
                        nodes[data.results[i].url].id = data.results[i].url;
                        for(var j = 0; j < data.results[i]['related-to'].length; j++){
                            let linkKey = data.results[i].url + '|' + data.results[i]['related-to'][j].url;
                            let inverseLinkKey = data.results[i]['related-to'][j].url + '|' + data.results[i].url;
                            if(!links[linkKey] && !links[inverseLinkKey]){
                                links[linkKey] = data.results[i]['related-to'][j];
                                links[linkKey].source = data.results[i].url;
                                links[linkKey].target =  data.results[i]['related-to'][j].url;
                                links[linkKey].weight = 1/((((data.results[i].url).split('\/')).length) - 3);
                                let subset = (data.results[i]['related-to'][j]['relationship-label']).split(/[\.]+/);
                                links[linkKey].type = subset[subset.length - 1];
                            }
                        }
                }

                for (var key in links) {
                    if (links.hasOwnProperty(key)) {
                        console.log(key + " -> " + links[key]);
                        if(!nodes[links[key].source] || !nodes[links[key].target]){
                              delete links[key];
                        }
                    }
                }
}
var chart = (chartId, nodesObj, linksObj, rawData, classContext) => {
             if(rawData.results.length <= PAGINATION_CONSTANT.RESULTS_PER_PAGE){
                populateGraphObject( nodesObj, linksObj, rawData);
                let links = Object.values(linksObj).map(d => Object.create(d));
                let nodes = Object.values(nodesObj).map(d => Object.create(d));
                let colors = d3.scaleOrdinal(d3.schemeCategory10);

                let svg = d3.select('#'+chartId),
                    width = +svg.attr("width"),
                    height = +svg.attr("height"),
                    node,
                    link,
                    edgepaths,
                    edgelabels;

                svg.html(null);
                var g = svg.append("g")
                            .attr("class", "everything");
                g.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "white");

                var forceLink = d3
                    .forceLink().id(function (d) {
                        return d.id;
                    })
                    .distance(function (d) {
                        return 1000 * d.weight;
                    })
                    .strength(1.5);

                var collisionForce = d3.forceCollide(100).strength(1.5).iterations(100);

                var simulation = d3.forceSimulation()
                    .force("link", forceLink)
                    .force("charge", d3.forceManyBody().strength(function (d, i) {
                            var a = i == 0 ? -2000 : -1000;
                            return a;
                        }).distanceMin(200).distanceMax(1000))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .force("collisionForce",collisionForce);

                //Zoom functions
                function zoom_actions(){
                    g.attr("transform", d3.event.transform)
                }
                //add zoom capabilities
                var zoom_handler = d3.zoom()
                    .on("zoom", zoom_actions);

                zoom_handler(svg);

                update(links, nodes);

                function zoomFit() {
                                 var bounds = g.node().getBBox();
                                 var parent = g.node().parentElement;
                                 var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
                                     fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
                                 var width = bounds.width,
                                     height = bounds.height;
                                 var midX = bounds.x + width / 2,
                                     midY = bounds.y + height / 2;
                                 if (width == 0 || height == 0) return; // nothing to fit
                                 var scale = 0.95 / Math.max(width / fullWidth, height / fullHeight);
                                 var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

                                 console.trace("zoomFit", translate, scale);

                                 /*zoom_handler.translateTo(g, translate[0], translate[1])
                                            .scaleTo(g, scale);*/
                }

                function update(links, nodes) {
                    link = g.selectAll(".link")
                        .data(links)
                        .enter()
                        .append("line")
                        .attrs({
                        'stroke': '#999',
                        'stroke-opacity': .6,
                        'stroke-width': '1px',
                        'id': function (d, i) {return 'line' + chartId + d.id}
                        });

                    link.append("title")
                        .text(function (d) {return d.type;});

                    edgepaths = g.selectAll(".edgepath")
                        .data(links)
                        .enter()
                        .append('path')
                        .attrs({
                            'class': 'edgepath',
                            'fill-opacity': 0,
                            'stroke-opacity': 0,
                            'id': function (d, i) {return 'edgepath' + chartId + d.id}
                        })
                        .style("pointer-events", "none");

                    /*edgelabels = g.selectAll(".edgelabel")
                        .data(links)
                        .enter()
                        .append('text')
                        .style("pointer-events", "none")
                        .attrs({
                            'class': 'edgelabel',
                            'id': function (d, i) {return 'edgelabel'  + chartId + d.id},
                            'font-size': 8,
                            'fill': '#aaa'
                        });

                    edgelabels.append('textPath')
                        .attr('xlink:href', function (d, i) {return '#edgepath' + chartId + d.id})
                        .style("text-anchor", "middle")
                        .style("pointer-events", "none")
                        .attr("startOffset", "50%")
                        .text(function (d) {return d.type});*/

                    node = g.selectAll(".node")
                        .data(nodes)
                        .enter()
                        .append("g")
                        .attr("class", "node")
                        .attr("id", function (d) {return "node" + chartId + (((decodeURIComponent(d.url)).replace(new RegExp('\/', 'g'),'-')).replace(new RegExp(':', 'g'),'-')).replace(new RegExp('\\.', 'g'),'-')})
                        .call(d3.drag()
                                 .on("start", dragstarted)
                                 .on("drag", dragged)
                                 .on("end", dragended)
                        );

                    node.append("svg:foreignObject")
                            .attr("width", 70)
                            .attr("height", 70)
                            .attr("x", -45)
                            .attr("dy", function (d) {return -1 * (Math.max((Math.round(d.weight * 250)/10), 2));})
                        .append("xhtml:span")
                    	      .attr("class", function (d) {return d.icon;})
                             .style("padding", "10px")
                             .style("font-size", function (d) {return Math.max(Math.round(d.weight * 250), 20) + "px";})
                             .attr("id", function (d) {return "nodeIcon" + chartId + (((decodeURIComponent(d.url)).replace(new RegExp('\/', 'g'),'-')).replace(new RegExp(':', 'g'),'-')).replace(new RegExp('\\.', 'g'),'-')})
                             .style("color", '#387dff')
                             .style("display", "block");


                    node.append("title")
                        .text(function (d) {return decodeURIComponent(d.id);});

                    node.append("text")
                        .attr("dy", 0)
                        .attr("dx", -10)
                        .attr('font-size', 10)
                        .text(function (d) {return d.nodeTypeLabel;})
                        .style("text-anchor", "middle");

                    node.append("text")
                        .attr("dy", function (d) {return (Math.max(Math.round(d.weight * 250) + 15, 55));})
                        .attr("dx", -10)
                        .attr('font-size', 8)
                        .text(function (d) {return decodeURIComponent(d.nodeKeyLabel);})
                        .style("text-anchor", "middle");

                    node.on("dblclick",function(d){ classContext.openNodeModal("test", d.url, d['node-type']) });

                    simulation
                        .nodes(nodes)
                        .on("tick", ticked)
                        .on("end", zoomFit);

                    simulation.force("link")
                        .links(links);

                    svg.on("dblclick.zoom", null);
                }

                function ticked() {
                    link
                        .attr("x1", function (d) {return d.source.x;})
                        .attr("y1", function (d) {return d.source.y;})
                        .attr("x2", function (d) {return d.target.x;})
                        .attr("y2", function (d) {return d.target.y;});

                    node
                        .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

                    edgepaths.attr('d', function (d) {
                        return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
                    });

                    /*edgelabels.attr('transform', function (d) {
                        if (d.target.x < d.source.x) {
                            let bbox = this.getBBox();
                            let rx = bbox.x + bbox.width / 2;
                            let ry = bbox.y + bbox.height / 2;
                            return 'rotate(180 ' + rx + ' ' + ry + ')';
                        }
                        else {
                            return 'rotate(0)';
                        }
                    });*/
                }

                function dragstarted(d) {
                    simulation.stop();
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                    d.x =  d3.event.x;
                    d.y =  d3.event.y;
                    ticked();
                }

                function dragended(d) {
                  d.fixed = true;
                  ticked();
                }
        }else{
             let svg = d3.select('#'+chartId),
                                width = +svg.attr("width"),
                                height = +svg.attr("height"),
                                node,
                                link,
                                edgepaths,
                                edgelabels;
             let svgHtml = "<foreignObject x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">" +
                                "<body xmlns=\"http://www.w3.org/1999/xhtml\">" +
                                    "<div class=\"svgbody\">" +
                                        "<h1>Graphical output is limited to " + PAGINATION_CONSTANT.RESULTS_PER_PAGE +
                                        " nodes. Your query returned " + rawData.results.length +
                                        " nodes, which the GUI does not support, please limit your query or if this data" +
                                        " is needed access it through our externally supported APIs." +
                                        "</h1>" +
                                     "</div>"+
                                "</body>"+
                            "</foreignObject>";
             svg.html(svgHtml);
        }
}
const OutputVisualization = (props) => {
    if (props.identifier && props.width && props.height && props.overflow) {
        return (
          <svg id={props.identifier} width={props.width} height={props.height} overflow={props.overflow}></svg>
        );

    }else{
        return (<p>Graph Configuration Error</p>);
    }
};

export default OutputVisualization;
export const Visualization = {
    chart: chart
}
