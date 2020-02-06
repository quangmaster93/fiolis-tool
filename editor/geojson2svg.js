export default function geojson2svg(geojson, option, sheetNum, parcelNum) {

  const defaultOption = {
      size: [1024, 1024],              // size[0] is svg width, size[1] is svg height
      padding: [20, 20, 20, 20],       // paddintTop, paddintRight, paddingBottom, paddingLeft, respectively
      output: 'string',                // output type: 'string'|'element'
      precision: 3,                    // svg coordinates precision
      stroke: 'red',                   // stroke color
      strokeWidth: '1px',              // stroke width
      background: '#fff',              // svg background color, and as the fill color of polygon hole
      fill: '#fff',                    // fill color
      fillOpacity: 1,                  // fill opacity
      radius: 5                        // only for `Point`, `MultiPoint`
  };

  const svg = {};
  let svgSize = [];
  let adjacentLands = [];
  let adjacentLandtranslate = [];
  let mainLand = '';
  let cordinateTable = '';
  // let metadata;
  let properties = {};
  const MAIN_LAND_KEY = 'main-land';
  const ADJACENT_LANDS_KEY = 'adjacent_lands';
  const PROPERTIES_KEY = 'properties_land';
  const SVG_EDIT_DEFAULT_KEY = 'svgedit-default';
  const SVG_EDIT_DATA_KEY = 'svgedit-data';
  const ADJACENT_MAKER = '<path id="adjacent-marker"/>';

  svg.style = function (svgStr, option) {
      const { fill, fillOpacity, stroke, strokeWidth } = option;
      const styles = [svgStr.split('/>')[0]];
      styles.push(`fill="${fill}"`);
      styles.push(`fill-opacity="${fillOpacity}"`);
      styles.push(`stroke="${stroke}"`);
      styles.push(`stroke-width="${strokeWidth}"`);
      return (styles.join(' ') + ' />');
  }

  svg.createCircle = function (point, option) {
      let [x, y] = point;
      let { radius, precision } = option;
      let svgStr = `<circle cx="${x.toFixed(precision)}" cy="${y.toFixed(precision)}" r="${radius.toFixed(precision)}" />`;
      return svg.style(svgStr, option);
  }

  svg.createPath = function (points, option, isMainLand = false) {
      let p = option.precision;
      // firefox cannot use common as splitor, so use space
      let pathd = points.map((pt, index) => {
          return `${index === 0 ? 'M' : 'L'}${pt[0].toFixed(p)} ${pt[1].toFixed(p)}`;
      }).join(' ');

      let mainLandItems = {
        centerLabels: '',
        verticeLabels: '',
        edgeLabels: ''
      };

      let svgStr;

      if (isMainLand) {
        svgStr = `<path d="${pathd}"/>`;
      } else {
        svgStr = `<path d="${pathd}" transform="translate(${-adjacentLandtranslate[0]}, ${-adjacentLandtranslate[1]})"/>`;
      }

      let svgStyle = svg.style(svgStr, option);
      let layerBreak = '';
      let landInfo = '';

      if (isMainLand) {
        mainLandItems = getMainLandItems(points);
        svgStyle = `<g class="layer" id="main-land"><title>Thửa chính</title>${svgStyle}`;
        layerBreak = `</g>`;
        landInfo = renderLandInfo(properties);
      }

      return `${landInfo}${svgStyle}${mainLandItems.centerLabels}${mainLandItems.verticeLabels}${mainLandItems.edgeLabels}${layerBreak}`;
  }

  // parse svg string to svg element
  svg.parseSVG = function (s) {
      let div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      div.innerHTML = s;
      let frag = document.createDocumentFragment();
      while (div.firstChild)
          frag.appendChild(div.firstChild);
      return frag;
  }

  /**
   * Get items of main land as: edge labels, vertice labels, center labels
   */
  function getMainLandItems(points) {
    // Contain info of polygon's vertice labels
    let verticeLabels = '';

    // Contain info of polygon's edge labels
    let edgeLabels = '';

    let centerLabels = '';

    let midPoint = [];

    let transform = '';

    const moveVerticeLabels = 5;

    const moveEdgeLabels = -4;

    const textFormat = `<text fill="#000" font-family="serif" font-size="10px" stroke="#000"
        stroke-width="0" style="cursor: move;" text-anchor="middle" xml:space="preserve"`;

    const moveLandType = properties.KyHieuMucDichSuDung.length > 3 ? 40 : 30;
    let centerPoint = getCenterPointCoordinate(points);
    centerPoint = [
        centerPoint[0] + moveLandType / 2,
        centerPoint[1]
    ]
    centerLabels += `${textFormat} x="${centerPoint[0] - moveLandType}" y="${centerPoint[1] + 3}">${properties.KyHieuMucDichSuDung}</text>`;
    centerLabels += `${textFormat} x="${centerPoint[0]}" y="${centerPoint[1] - 5}">${properties.SoThuTuThua} (${properties.SoHieuToBanDo})</text>`;
    centerLabels += `<line fill="none" stroke="#000" stroke-width="1" x1="${centerPoint[0] - 15}" x2="${centerPoint[0] + 15}" y1="${centerPoint[1]}" y2="${centerPoint[1]}"/>`;
    centerLabels += `${textFormat} x="${centerPoint[0]}" y="${centerPoint[1] + 11}">${properties.DienTich}</text>`;

    // Render vertice labels and edge labels of polygon
    for (let index = 0; index < (points || []).length; index++) {
        if (index < points.length - 1) {

            // Render vertice labels of polygon
            verticeLabels += `${textFormat} x="${points[index][0] + moveVerticeLabels}" y="${points[index][1] + moveVerticeLabels}">${index + 1}</text>`;

            midPoint = getMidpointCoordinate(points[index], points[index + 1]);

            // Rotate edge label folow edge
            // transform = `transform="rotate(${angleBetweenPoints(points[index], points[index + 1], midPoint, centerPoint)} ${midPoint[0]} ${midPoint[1]})"`;

            // Render edge labels of polygon
            // edgeLabels += `${textFormat} x="${midPoint[0] + moveEdgeLabels}" y="${midPoint[1] + moveEdgeLabels}" ${transform}>${(+properties.calculate[0][0][0].distances[index]).toFixed(2)} m</text>`;
            edgeLabels += `${textFormat} x="${midPoint[0] + moveEdgeLabels}" y="${midPoint[1] + moveEdgeLabels}">${(+properties.calculate[0][0][0].distances[index]).toFixed(2)}</text>`;
        }
    }

    return {
        centerLabels: centerLabels,
        verticeLabels: verticeLabels,
        edgeLabels: edgeLabels
    };
  }

  function angleBetweenPoints(point1, point2, midPoint, centerPoint) {
    let rotate = centerPoint[1] - midPoint[1] < 0 ? 180 : 0;
    return (Math.atan2(point2[1] - point1[1], point2[0] - point1[0]) * 180 / Math.PI) + rotate;
  }

  function renderCordinateTable(points, edgeLabels) {
      let raws = '';
      const yAxesStart = 20;
      let yAxes = 25;
      let yAxesIncrease = 12;
      let [xStart, yStart] = [625, 700];

      // Calculate end point's y coordinates
      const endPointY = yAxes + yAxesIncrease * edgeLabels.length + 10;

      // Draw the raws of table
      (points || []).forEach((pt, index) => {
        if (index < points.length - 1) {
            yAxes += yAxesIncrease;
            raws += 
                `
                <text font-size="10px" text-anchor="middle" x="${xStart + yAxesStart}" y="${yStart + 32}" alignment-baseline="middle">
                    <tspan fill="#000" text-anchor="start" x="${xStart + yAxesStart}" y="${yStart + yAxes}">${index + 1}</tspan>
                    <tspan x="${xStart + 85}" y="${yStart + yAxes}">${pt[0].toFixed(2)}</tspan>
                    <tspan x="${xStart + 160}" y="${yStart + yAxes}">${pt[1].toFixed(2)}</tspan>
                    <tspan x="${xStart + 235}" y="${yStart + yAxes}">${(+edgeLabels[index]).toFixed(2)}</tspan>
                </text>
                `;
        }
      });

      const table =
      `
        <g class="layer" id="cordinates-table">
            <title>Bảng tọa độ góc ranh</title>
            <g class="layer" id="table" xmlns="http://www.w3.org/2000/svg">
                <text fill="#000" font-size="10px" font-weight="bold" text-anchor="middle" x="${xStart + 135}" y="${yStart + 5}">
                BẢNG LIỆT KÊ TỌA ĐỘ GÓC RANH
                </text>
                <rect fill="none" height="15" id="header" stroke="#000" width="260" x="${xStart + 10}" y="${yStart + 10}" xmlns="http://www.w3.org/2000/svg"/>
                <line fill="none" stroke="#000" x1="${xStart + 10}" x2="${xStart + 10}" y1="${yStart + 25}" y2="${yStart + endPointY}"/>
                <line fill="none" stroke="#000" x1="${xStart + 50}" x2="${xStart + 50}" y1="${yStart + 10}" y2="${yStart + endPointY}"/>
                <line fill="none" stroke="#000" x1="${xStart + 120}" x2="${xStart + 120}" y1="${yStart + 10}" y2="${yStart + endPointY}"/>
                <line fill="none" stroke="#000" x1="${xStart + 200}" x2="${xStart + 200}" y1="${yStart + 10}" y2="${yStart + endPointY}"/>
                <line fill="none" stroke="#000" x1="${xStart + 270}" x2="${xStart + 270}" y1="${yStart + 25}" y2="${yStart + endPointY}"/>
                <line fill="none"  stroke="#000" x1="${xStart + 10}" x2="${xStart + 270}" y1="${yStart + endPointY}" y2="${yStart + endPointY}"/>
                <text fill="#000" font-size="10px" text-anchor="middle" x="${xStart + 30}" y="${yStart + yAxesStart}">
                    <tspan x="${xStart + 30}" y="${yStart + yAxesStart}">Điểm</tspan>
                    <tspan x="${xStart + 85}" y="${yStart + yAxesStart}">X (m)</tspan>
                    <tspan x="${xStart + 160}" y="${yStart + yAxesStart}">Y (m)</tspan>
                    <tspan x="${xStart + 235}" y="${yStart + yAxesStart}">Cạnh (m)</tspan>
                </text>
                ${raws}
            </g>
        </g>
      `
      return table;
  }

  function renderLandInfo(properties) {
      if (properties.capHanhChinh && properties.capHanhChinh.length < 4) {
        return '';
      }

      const capHanhChinh = properties.capHanhChinh;

      const landInfoText =
        `LÔ ĐẤT SỐ : ${properties.SoThuTuThua}, TỜ BẢN ĐỒ SỐ : ${properties.SoHieuToBanDo},
        ${capHanhChinh[0].description}: ${capHanhChinh[0].name},
        ${capHanhChinh[1].description}: ${capHanhChinh[1].name},
        ${capHanhChinh[2].description}: ${capHanhChinh[2].name}
        `;

      const landInfo =
        `
        <g class="layer" id="land-info" xmlns="http://www.w3.org/2000/svg">
            <title>Thông tin thửa đất</title>
            <text fill="#4a84e3" font-size="10px" font-weight="bold" text-anchor="right" x="40" y="40">
              ${landInfoText.toUpperCase()}
            </text>
        </g>
        `;

      return landInfo;
  }

  function getMidpointCoordinate(firstPoint, secondPoint) {
      return [firstPoint[0] + (secondPoint[0] - firstPoint[0]) / 2, firstPoint[1] + (secondPoint[1] - firstPoint[1]) / 2];
  }

  function getCenterPointCoordinate(points) {
      const extent = getExtent(points);

      const centerPoint = [
        extent[0] + ((extent[2] - extent[0]) / 2),
        extent[1] + ((extent[3] - extent[1]) / 2)
      ];

      return centerPoint;
  }

  function getExtent(points) {
      let extent = [Infinity, Infinity, -Infinity, -Infinity];
      points.forEach(pt => {
          let [x, y] = pt;
          if (x < extent[0]) extent[0] = x;
          if (x > extent[2]) extent[2] = x;
          if (y < extent[1]) extent[1] = y;
          if (y > extent[3]) extent[3] = y;
      });
      return extent;
  }

  // get all points from geojson object
  function getAllPoints(geojson) {
      // get all points from geojson object
      switch (geojson.type) {
          case 'Point': {
              return [geojson.coordinates];
          }
          case 'MultiPoint':
          case 'LineString': {
              return geojson.coordinates;
              break;
          }
          case 'MultiLineString':
          case 'Polygon': {
              let pointsArr = geojson.coordinates;
              return pointsArr.reduce((prev, item) => prev.concat(item), pointsArr[0]);
          }
          case 'MultiPolygon': {
              let multiArr = geojson.coordinates;
              let arr = multiArr.reduce((prev, item) => prev.concat(item), multiArr[0]);
              return arr.reduce((prev, item) => prev.concat(item), arr[0]);
          }
          case 'GeometryCollection': {
              let geometries = geojson.geometries;
              let pointsArr = geometries.map(geom => getAllPoints(geom));
              return pointsArr.reduce((prev, item) => prev.concat(item), pointsArr[0]);
          }
          case 'Feature': {
              // if (!metadata) {
              //   metadata = geojson.properties;
              // }
              return getAllPoints(geojson.geometry);
          }
          case 'FeatureCollection': {
              let features = geojson.features;
              let pointsArr = features.map(feature => getAllPoints(feature));
              return pointsArr.reduce((prev, item) => prev.concat(item), pointsArr[0]);
          }
      }
  }

  function geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, padding) {
      let paddingLeft = padding[3];
      let paddingTop = padding[0];
      let [geometryWidth, geometryHeight] = geometrySize;
      let x = (pt[0] - origin[0]) / res + paddingLeft;
      // y direction of svg coord system is different from geojson's 
      let y = geometryHeight - (pt[1] - origin[1]) / res + paddingTop;
      // adjust shape in the middle of svg element
      if (xRes > yRes) {
          let dy = (geometryHeight - (extent[3] - extent[1]) / res) / 2;
          y = y - dy;
      } else {
          let dx = (geometryWidth - (extent[2] - extent[0]) / res) / 2;
          x = x + dx;
      }
      return [x, y]
  }

  // converter
  const converter = {};
  /**
   * 
   * @param {Array[]} points 
   * @param {string} basicGeometryType 取值 'Point' | 'LineString' | 'Polygon'
   * @param {Object} option
   * @return {string}
   */
  converter.convertBasicGeometry = function (points, basicGeometryType, option) {
      switch (basicGeometryType) {
          case 'Point': {
              return svg.createCircle(points[0], option);
          }
          case 'LineString': {
              return svg.createPath(points, option);
          }
          case 'Polygon': {
              return svg.createPath(points, option);
          }
      }
  }

  converter.getCommonOpt = function (geojson, option) {
      let [svgWidth, svgHeight] = option.size;
      let [paddingTop, paddingRight, paddingBottom, paddingLeft] = option.padding;
      let geometryWidth = svgWidth - paddingLeft - paddingRight;
      let geometryHeight = svgHeight - paddingTop - paddingBottom;
      // get the extent
      const geojsonConverted = {
        ...geojson,
        features: (geojson.features || []).slice(0, 1)
      }
      let extent = getExtent(getAllPoints(geojsonConverted));
      // calculate resolution
      let xRes = (extent[2] - extent[0]) / geometryWidth;  // x resolution
      let yRes = (extent[3] - extent[1]) / geometryHeight; // y resolution
      let res = (xRes > yRes ? xRes : yRes);              // max resolution

      let commonOpt = {
          xRes: xRes,
          yRes: yRes,
          res: res,
          extent: extent,
          origin: [extent[0], extent[1]],
          geometrySize: [geometryWidth, geometryHeight]
      };

      svgSize = option.size;

      return commonOpt;
  }

  converter.convertPoint = function (geojson, option, commonOpt, isMainLand = false) {
      let { xRes, yRes, res, extent, origin, geometrySize } = commonOpt;
      let center = geoPointToPixelPoint(geojson.coordinates, geometrySize, xRes, yRes, res, extent, origin, option.padding);
      return svg.createCircle(center, option);
  }

  converter.convertMultiPoint = function (geojson, option, commonOpt, isMainLand = false) {
      let { xRes, yRes, res, extent, origin, geometrySize } = commonOpt;
      // callers are supposed to set reasonable padding themselves.
      // option.padding = option.padding.map(item => item + radius);  // comment it
      let svgStr = geojson.coordinates
          // map geographical point to pixel point
          .map(pt => {
              return geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, option.padding);
          })
          // map pixel point to svg string
          .map(pt => svg.createCircle(pt, option))
          .join('');
      return svgStr;
  }

  converter.convertLineString = function (geojson, option, commonOpt, isMainLand = false) {
      let { xRes, yRes, res, extent, origin, geometrySize } = commonOpt;
      let coords = (Array.isArray(geojson) ? geojson : geojson.coordinates);
      let pixelPoints = coords.map(pt => {
          return geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, option.padding);
      });
      // [Important] change linestring fill opacity, using a copy of option
      let optionForLineString = {};
      Object.assign(optionForLineString, option);
      optionForLineString.fillOpacity = 0;
      return svg.createPath(pixelPoints, optionForLineString);
  }

  converter.convertMultiLineString = function (geojson, option, commonOpt, isMainLand = false) {
      return geojson.coordinates.map(points => {
          return converter.convertLineString(points, option, commonOpt);
      }).join('');
  }

  converter.convertPolygon = function (geojson, option, commonOpt, isMainLand = false) {
      let { xRes, yRes, res, extent, origin, geometrySize } = commonOpt;
      let coords = (Array.isArray(geojson) ? geojson : geojson.coordinates);

      // option for inner polygon
      let optionForInner = {};
      Object.assign(optionForInner, option);
      optionForInner.fill = option.background;
      optionForInner.fillOpacity = 1;

      const path = coords.map((points, index) => {
          let pixelPoints = points.map(pt => geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, option.padding));

          if (isMainLand) {
              cordinateTable = renderCordinateTable(points, properties.calculate[0][0][0].distances)
          }
          // the first polygon is outer polygon
          if (index == 0 || Array.isArray(geojson)) {
              return svg.createPath(pixelPoints, option, isMainLand);
          }
          // the others are inner polygon, so change their fill style
          return svg.createPath(pixelPoints, optionForInner, isMainLand);
      }).join('');

      if (isMainLand) {
          mainLand = path;
      } else {
          adjacentLands = [...adjacentLands, path];
      }

      return path;
  }

  converter.convertMultiPolygon = function (geojson, option, commonOpt, isMainLand = false) {
      return geojson.coordinates.map((points, index) => {
          return converter.convertPolygon(points, option, commonOpt, isMainLand);
      }).join('');
  }

  converter.convertGeometryCollection = function (geojson, option, commonOpt, isMainLand = false) {
      let geoms = geojson.geometries;
      return geoms.map(geom => {
          let funcName = `convert${geom.type}`;
          return converter[funcName](geom, option, commonOpt);
      }).join('');
  }

  converter.convertFeature = function (geojson, option, commonOpt) {
      let geom = geojson.geometry;
      const isMainLand = geojson.properties ? geojson.properties.isMainLand : false;
      let funcName = `convert${geom.type}`;
      return converter[funcName](geom, option, commonOpt, isMainLand);
  }

  converter.convertFeatureCollection = function (geojson, option, commonOpt) {
      let features = geojson.features;
      return features.map(feature => {
          return converter.convertFeature(feature, option, commonOpt);
      }).join('');
  }

  const convertToSvg = function(geojson, option, sheetNum, parcelNum) {
      // Extend size is 20%
      const extendSize = 0.2;
      const mainLandSize = [
        option.size[0] - option.padding[1] - option.padding[3],
        option.size[1] - option.padding[0] - option.padding[2]
      ]
      adjacentLandtranslate = [
        option.padding[0] - mainLandSize[0] * extendSize,
        option.padding[3] - mainLandSize[1] * extendSize
      ]
      const type = geojson.type;
      let funcName = 'convert' + type;
      if (!converter[funcName]) {
          throw new Error('The type of input object is not supported.');
      }
      let commonOpt = converter.getCommonOpt(geojson, option);
      // init option
      option = option || {};
      for (let key in defaultOption) {
          option[key] = option[key] || defaultOption[key];
      }
      let fullSvgStr = '<svg xmlns="http://www.w3.org/2000/svg" style="background:' + option.background + '" width="' + (option.size[0]) + '" height="' + (option.size[1]) + '">';
      fullSvgStr += `
        <g class="layer" display="none" id="adjacent-lands" transform="translate(${adjacentLandtranslate[0]}, ${adjacentLandtranslate[1]})">
          <title>Thửa liền kề</title>
      `;

      // Add metadata for svg
      // fullSvgStr += `<metadata>${JSON.stringify(metadata)}</metadata>`;
      let convert = converter[funcName];

      // handle one point
      // TODO more complicated situation
      if (type === 'Point' || 
         (type === 'GeometryCollection' && geojson.geometries.length === 1 && geojson.geometries[0].type === 'Point') ||
         (type === 'FeatureCollection' && geojson.features.length === 1 
          && geojson.features[0].geometry.type === 'Point' )) {
          convert = (geojson, option, commonOpt) => {
              let { xRes, yRes, res, extent, origin, geometrySize } = commonOpt;
              let [paddingTop, paddingRight, paddingBottom, paddingLeft] = option.padding;
              let center = [paddingLeft + geometrySize[0] / 2, paddingTop + geometrySize[1] / 2];
              return svg.createCircle(center, option);
          }
      }

      if (geojson.features &&
        geojson.features.length > 0 &&
        geojson.features[0].properties
      ) {
        properties = geojson.features[0].properties;
        geojson.features[0].properties.isMainLand = true;
      }

      convert(geojson, option, commonOpt);

      // fullSvgStr += `${ADJACENT_MAKER}${ADJACENT_MAKER}</g>`;
      const adjacentLandSize = [
        mainLandSize[0] + mainLandSize[0] * extendSize * 2,
        mainLandSize[1] + mainLandSize[1] * extendSize * 2
      ];
      fullSvgStr += `
          <svg preserveAspectRatio="xMinYMin slice" width="${adjacentLandSize[0]}" height="${adjacentLandSize[1]}">
            ${adjacentLands}
          </svg>
        </g>
      `;

      fullSvgStr += `${cordinateTable}`;
      fullSvgStr += `${mainLand}</svg>`;

      // Save svg data into local storage
      localStorage.setItem(SVG_EDIT_DEFAULT_KEY, fullSvgStr);
      // localStorage.setItem(ADJACENT_LANDS_KEY, adjacentLands);
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
      $("#txtSoTo").val(properties.SoHieuToBanDo);
      $("#txtSoThua").val(properties.SoThuTuThua);
      $("#txtCodeDiaChinh").val(properties.MaXa);
      return {
          mainLand: fullSvgStr,
          adjacentLands: adjacentLands,
          properties: properties
      };
  }

  return convertToSvg(geojson, option, sheetNum, parcelNum);
};