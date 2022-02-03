var dataset = ee.Image('USGS/3DEP/10m')
var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation);

// commented code for shapefile-based options
// var watershed = ee.FeatureCollection('users/watersheds/watershed.shp')

// pull in USGS HUC dataset. Any HUC level will work in this script, but,
// the HUC lines must be changed everywhere and uniformly for this to work
var huc = ee.FeatureCollection('USGS/WBD/2017/HUC10');

// in this example, we use the HUC10 ID for Spanish Creek, a tributary to
// the Feather River in Northern California. Swap thise for the code of whatever
// your watershed of interest is.
var watershed = huc.filter("huc10 == '1802012208'")

// add the watershed outline to the map
Map.addLayer(watershed, {}, 'USGS/WBD/2017/HUC10');

// clip the elevation raster to your watershed
var watershed_dtm = slope.clip(watershed)
var watershed_dem = elevation.clip(watershed)

var projection = watershed_dem.projection().getInfo();

Map.addLayer(watershed_dtm, {min: 0, max: 60}, 'slope');

// Export a cloud-optimized GeoTIFF.
Export.image.toDrive({
  image: watershed_dem,
  description: 'watershed_elevation',
  crs: projection.crs,
  crsTransform: projection.transform,
  region: watershed,
  fileFormat: 'GeoTIFF',
  maxPixels: 16327552503,
  formatOptions: {
    cloudOptimized: true
  }
});
