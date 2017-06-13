/*
 We use Albers equal-area projection.
 Formulas are from https://en.wikipedia.org/wiki/Albers_projection.

 Parameters are described in https://docs.lib.noaa.gov/rescue/cgs_specpubs/QB275U35no2361945.pdf
 O.S. Adams's General Theory of Equivalent Projections (1945) (p.37, of the article not the PDF)

 "Besides the representation of the two hemispheres just described,
 it is sometimes desired to represent the whole world on one map.
 If it is desired to have an equal-area map of this kind,
 it would be necessary to use a conic projection with minimum deformations
 between the north pole and 50º south latitude.
 The deformation beyond the parallel of 50º south would not be troublesome as no land of importance
 lies beyond that point, since only a tip of South America extends further south.
 The north pole should be taken as the center and the separation should be made at 170º west longitude
 which passes through Bering Strait and does not meet any land area.
 This projection corresponds to m=0.432; it does not produce any deformation along the parallel of 18º25' south;
 at the north pole, a singular point of the projection, 2δ amounts to 118º26'.
 The greatest value of 2δ besides this point is 58º43'; of a², 1.710 and of a², 2.924."
*/
function fromCoordsToMeters (point) {
    var R = 6378137,
        lng = point[1],
        lat = point[0];

    // 170 west longitude is the separation point. So we should consider 170+ west
    // longitudes as 180+ east longitudes (discovered experimentally).
    var lambda = degreesToRad(lng < -169 ? 180 * 2 + lng : lng),
        lambda0 = degreesToRad(-10),
        phi = degreesToRad(lat),
        phi0 = degreesToRad(90),
        phi1 = degreesToRad(90),
        phi2 = degreesToRad(-(18 + 25 / 60));

    var n = (Math.sin(phi1) + Math.sin(phi2)) / 2,
        theta = n * (lambda - lambda0),
        C = Math.pow(Math.cos(phi1), 2) + 2 * n * Math.sin(phi1),
        rho = Math.sqrt(C - 2 * n * Math.sin(phi)) / n,
        rho0 = Math.sqrt(C - 2 * n * Math.sin(phi0)) / n;

    var x = rho * Math.sin(theta),
        y = rho0 - rho * Math.cos(theta);

    return [x * R, y * R];
}

function degreesToRad (degrees) {
   return degrees * Math.PI / 180;
}

// http://algolist.manual.ru/maths/geom/polygon/area.php
function calculateArea (projectedCoordinates) {
    var sum = 0;
    for (var i = 0, l = coordinates.length; i < l; i++) {
        var j = (i < l - 1) ? i + 1 : 0;
        sum += (coordinates[i][0] + coordinates[j][0]) * (coordinates[i][1] - coordinates[j][1]);
    }
    return Math.abs(sum) / 2;
}