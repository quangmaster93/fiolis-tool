export default function geojson2svg(geojson, option, sheetNum, parcelNum) {

  const defaultOption = {
      size: [256, 256],                // size[0] is svg width, size[1] is svg height
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
  let adjacentLands = [];
  let mainLand = '';
  let metadata;
  let properties = {};
  const MAIN_LAND_KEY = 'main-land';
  const ADJACENT_LANDS_KEY = 'adjacent_lands';
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

      // Contain info of polygon's vertice labels
      let verticeLabels = '';

      // Contain info of polygon's edge labels
      let edgeLabels = '';

      let midPoint = [];

      if (isMainLand) {
        // Render vertice labels and edge labels of polygon
        for (let index = 0; index < (points || []).length; index++) {
          if (index < points.length - 1) {
            const textFormat = `<text fill="#000" font-family="serif" font-size="16" stroke="#000"
            stroke-dasharray="null" stroke-linecap="null" stroke-linejoin="null" stroke-width="0"
            style="cursor: move;" text-anchor="middle" xml:space="preserve"`;

            // Render vertice labels of polygon
            verticeLabels += `${textFormat} x="${points[index][0]}" y="${points[index][1]}">${index + 1}</text>`;
    
            midPoint = getMidpointCoordinate(points[index], points[index + 1]);

            // Render edge labels of polygon
            edgeLabels += `${textFormat} x="${midPoint[0]}" y="${midPoint[1]}">C${index + 1}</text>`;
          }
        }
      }

      const svgStr = `<path d="${pathd}" />`;
      const svgStyle = svg.style(svgStr, option);
      const adjacentMarker = isMainLand ? ADJACENT_MAKER : '';

      return `${svgStyle}${verticeLabels}${edgeLabels}${adjacentMarker}`;
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

  function getMidpointCoordinate(firstPoint, secondPoint) {
      return [firstPoint[0] + (secondPoint[0] - firstPoint[0]) / 2, firstPoint[1] + (secondPoint[1] - firstPoint[1]) / 2];
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
              if (!metadata) {
                metadata = geojson.properties;
              }
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
      let extent = getExtent(getAllPoints(geojson));
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
      }
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
      let fullSvgStr = '<svg xmlns="http://www.w3.org/2000/svg" style="background:' + option.background + '" width="' + (option.size[0] * 2) + '" height="' + (option.size[1] * 2) + '" >';

      // Add metadata for svg
      fullSvgStr += `<metadata>${JSON.stringify(metadata)}</metadata>`
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

      // geojson.features.map(
      //     feature => {
      //       if(feature.properties &&
      //           feature.properties.SoHieuToBanDo === parseInt(sheetNum) &&
      //           feature.properties.SoThuTuThua === parseInt(parcelNum)) {
      //               properties = feature.properties;
      //               return feature.properties.isMainLand = true;
      //       }
      //     }
      // )

      convert(geojson, option, commonOpt);

      fullSvgStr += `${mainLand}${ADJACENT_MAKER}`;
      fullSvgStr += `</svg>`;

      // Save svg data into local storage
      localStorage.setItem(SVG_EDIT_DEFAULT_KEY, fullSvgStr);
      localStorage.setItem(ADJACENT_LANDS_KEY, adjacentLands);
      return {
          mainLand: fullSvgStr,
          adjacentLands: adjacentLands,
          properties: properties
      };
  }

  return convertToSvg(geojson, option, sheetNum, parcelNum);
};