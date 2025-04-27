// focus_shield_model.js - ML model logic for distraction prediction
// Paste your converted model here
function score(input) {
    var var0;
    if (input[1] <= 149.5) {
        var0 = [0.0, 1.0];
    } else {
        var0 = [1.0, 0.0];
    }
    var var1;
    if (input[2] <= 129.5) {
        var1 = [0.0, 1.0];
    } else {
        var1 = [1.0, 0.0];
    }
    var var2;
    if (input[4] <= 49.5) {
        var2 = [1.0, 0.0];
    } else {
        var2 = [0.0, 1.0];
    }
    var var3;
    if (input[2] <= 129.5) {
        var3 = [0.0, 1.0];
    } else {
        var3 = [1.0, 0.0];
    }
    var var4;
    if (input[0] <= 129.5) {
        var4 = [1.0, 0.0];
    } else {
        var4 = [0.0, 1.0];
    }
    var var5;
    if (input[1] <= 149.5) {
        var5 = [0.0, 1.0];
    } else {
        var5 = [1.0, 0.0];
    }
    var var6;
    if (input[4] <= 49.5) {
        var6 = [1.0, 0.0];
    } else {
        var6 = [0.0, 1.0];
    }
    var var7;
    if (input[0] <= 129.5) {
        var7 = [1.0, 0.0];
    } else {
        var7 = [0.0, 1.0];
    }
    var var8;
    if (input[2] <= 129.5) {
        var8 = [0.0, 1.0];
    } else {
        var8 = [1.0, 0.0];
    }
    var var9;
    if (input[4] <= 49.5) {
        var9 = [1.0, 0.0];
    } else {
        var9 = [0.0, 1.0];
    }
    var var10;
    if (input[0] <= 129.5) {
        var10 = [1.0, 0.0];
    } else {
        var10 = [0.0, 1.0];
    }
    var var11;
    if (input[1] <= 149.0) {
        var11 = [0.0, 1.0];
    } else {
        var11 = [1.0, 0.0];
    }
    var var12;
    if (input[2] <= 129.5) {
        var12 = [0.0, 1.0];
    } else {
        var12 = [1.0, 0.0];
    }
    var var13;
    if (input[2] <= 129.5) {
        var13 = [0.0, 1.0];
    } else {
        var13 = [1.0, 0.0];
    }
    var var14;
    if (input[1] <= 149.5) {
        var14 = [0.0, 1.0];
    } else {
        var14 = [1.0, 0.0];
    }
    var var15;
    if (input[4] <= 49.5) {
        var15 = [1.0, 0.0];
    } else {
        var15 = [0.0, 1.0];
    }
    var var16;
    if (input[5] <= 19.5) {
        if (input[4] <= 49.5) {
            var16 = [1.0, 0.0];
        } else {
            var16 = [0.0, 1.0];
        }
    } else {
        var16 = [1.0, 0.0];
    }
    var var17;
    if (input[0] <= 129.5) {
        var17 = [1.0, 0.0];
    } else {
        var17 = [0.0, 1.0];
    }
    var var18;
    if (input[4] <= 49.5) {
        var18 = [1.0, 0.0];
    } else {
        var18 = [0.0, 1.0];
    }
    var var19;
    if (input[2] <= 129.5) {
        var19 = [0.0, 1.0];
    } else {
        var19 = [1.0, 0.0];
    }
    var var20;
    if (input[1] <= 149.5) {
        var20 = [0.0, 1.0];
    } else {
        var20 = [1.0, 0.0];
    }
    var var21;
    if (input[3] <= 19.5) {
        if (input[5] <= 19.5) {
            if (input[4] <= 49.5) {
                var21 = [1.0, 0.0];
            } else {
                var21 = [0.0, 1.0];
            }
        } else {
            var21 = [1.0, 0.0];
        }
    } else {
        var21 = [1.0, 0.0];
    }
    var var22;
    if (input[4] <= 49.5) {
        var22 = [1.0, 0.0];
    } else {
        var22 = [0.0, 1.0];
    }
    var var23;
    if (input[1] <= 149.5) {
        var23 = [0.0, 1.0];
    } else {
        var23 = [1.0, 0.0];
    }
    var var24;
    if (input[1] <= 149.5) {
        var24 = [0.0, 1.0];
    } else {
        var24 = [1.0, 0.0];
    }
    var var25;
    if (input[0] <= 129.5) {
        var25 = [1.0, 0.0];
    } else {
        var25 = [0.0, 1.0];
    }
    var var26;
    if (input[2] <= 129.5) {
        var26 = [0.0, 1.0];
    } else {
        var26 = [1.0, 0.0];
    }
    var var27;
    if (input[4] <= 49.5) {
        var27 = [1.0, 0.0];
    } else {
        var27 = [0.0, 1.0];
    }
    var var28;
    if (input[0] <= 129.5) {
        var28 = [1.0, 0.0];
    } else {
        var28 = [0.0, 1.0];
    }
    var var29;
    if (input[4] <= 49.5) {
        var29 = [1.0, 0.0];
    } else {
        var29 = [0.0, 1.0];
    }
    var var30;
    if (input[4] <= 49.5) {
        var30 = [1.0, 0.0];
    } else {
        var30 = [0.0, 1.0];
    }
    var var31;
    if (input[5] <= 19.5) {
        if (input[1] <= 149.5) {
            var31 = [0.0, 1.0];
        } else {
            var31 = [1.0, 0.0];
        }
    } else {
        var31 = [1.0, 0.0];
    }
    var var32;
    if (input[1] <= 149.5) {
        var32 = [0.0, 1.0];
    } else {
        var32 = [1.0, 0.0];
    }
    var var33;
    if (input[0] <= 129.5) {
        var33 = [1.0, 0.0];
    } else {
        var33 = [0.0, 1.0];
    }
    var var34;
    if (input[2] <= 129.5) {
        var34 = [0.0, 1.0];
    } else {
        var34 = [1.0, 0.0];
    }
    var var35;
    if (input[1] <= 149.5) {
        var35 = [0.0, 1.0];
    } else {
        var35 = [1.0, 0.0];
    }
    var var36;
    if (input[0] <= 129.5) {
        var36 = [1.0, 0.0];
    } else {
        var36 = [0.0, 1.0];
    }
    var var37;
    if (input[1] <= 149.5) {
        var37 = [0.0, 1.0];
    } else {
        var37 = [1.0, 0.0];
    }
    var var38;
    if (input[4] <= 49.5) {
        var38 = [1.0, 0.0];
    } else {
        var38 = [0.0, 1.0];
    }
    var var39;
    if (input[4] <= 49.5) {
        var39 = [1.0, 0.0];
    } else {
        var39 = [0.0, 1.0];
    }
    var var40;
    if (input[4] <= 49.5) {
        var40 = [1.0, 0.0];
    } else {
        var40 = [0.0, 1.0];
    }
    var var41;
    if (input[2] <= 129.5) {
        var41 = [0.0, 1.0];
    } else {
        var41 = [1.0, 0.0];
    }
    var var42;
    if (input[0] <= 129.5) {
        var42 = [1.0, 0.0];
    } else {
        var42 = [0.0, 1.0];
    }
    var var43;
    if (input[2] <= 129.5) {
        var43 = [0.0, 1.0];
    } else {
        var43 = [1.0, 0.0];
    }
    var var44;
    if (input[2] <= 129.5) {
        var44 = [0.0, 1.0];
    } else {
        var44 = [1.0, 0.0];
    }
    var var45;
    if (input[1] <= 149.5) {
        var45 = [0.0, 1.0];
    } else {
        var45 = [1.0, 0.0];
    }
    var var46;
    if (input[1] <= 149.5) {
        var46 = [0.0, 1.0];
    } else {
        var46 = [1.0, 0.0];
    }
    var var47;
    if (input[0] <= 130.0) {
        var47 = [1.0, 0.0];
    } else {
        var47 = [0.0, 1.0];
    }
    var var48;
    if (input[4] <= 49.5) {
        var48 = [1.0, 0.0];
    } else {
        var48 = [0.0, 1.0];
    }
    var var49;
    if (input[0] <= 129.5) {
        var49 = [1.0, 0.0];
    } else {
        var49 = [0.0, 1.0];
    }
    var var50;
    if (input[4] <= 49.5) {
        var50 = [1.0, 0.0];
    } else {
        var50 = [0.0, 1.0];
    }
    var var51;
    if (input[4] <= 49.5) {
        var51 = [1.0, 0.0];
    } else {
        var51 = [0.0, 1.0];
    }
    var var52;
    if (input[0] <= 129.5) {
        var52 = [1.0, 0.0];
    } else {
        var52 = [0.0, 1.0];
    }
    var var53;
    if (input[2] <= 129.5) {
        var53 = [0.0, 1.0];
    } else {
        var53 = [1.0, 0.0];
    }
    var var54;
    if (input[2] <= 129.5) {
        var54 = [0.0, 1.0];
    } else {
        var54 = [1.0, 0.0];
    }
    var var55;
    if (input[1] <= 149.5) {
        var55 = [0.0, 1.0];
    } else {
        var55 = [1.0, 0.0];
    }
    var var56;
    if (input[0] <= 129.5) {
        var56 = [1.0, 0.0];
    } else {
        var56 = [0.0, 1.0];
    }
    var var57;
    if (input[1] <= 149.5) {
        var57 = [0.0, 1.0];
    } else {
        var57 = [1.0, 0.0];
    }
    var var58;
    if (input[4] <= 49.5) {
        var58 = [1.0, 0.0];
    } else {
        var58 = [0.0, 1.0];
    }
    var var59;
    if (input[1] <= 149.5) {
        var59 = [0.0, 1.0];
    } else {
        var59 = [1.0, 0.0];
    }
    var var60;
    if (input[4] <= 49.5) {
        var60 = [1.0, 0.0];
    } else {
        var60 = [0.0, 1.0];
    }
    var var61;
    if (input[3] <= 19.5) {
        if (input[4] <= 49.5) {
            var61 = [1.0, 0.0];
        } else {
            var61 = [0.0, 1.0];
        }
    } else {
        var61 = [1.0, 0.0];
    }
    var var62;
    if (input[2] <= 129.5) {
        var62 = [0.0, 1.0];
    } else {
        var62 = [1.0, 0.0];
    }
    var var63;
    if (input[2] <= 129.5) {
        var63 = [0.0, 1.0];
    } else {
        var63 = [1.0, 0.0];
    }
    var var64;
    if (input[1] <= 149.0) {
        var64 = [0.0, 1.0];
    } else {
        var64 = [1.0, 0.0];
    }
    var var65;
    if (input[0] <= 129.5) {
        var65 = [1.0, 0.0];
    } else {
        var65 = [0.0, 1.0];
    }
    var var66;
    if (input[1] <= 149.5) {
        var66 = [0.0, 1.0];
    } else {
        var66 = [1.0, 0.0];
    }
    var var67;
    if (input[5] <= 19.5) {
        if (input[4] <= 49.5) {
            var67 = [1.0, 0.0];
        } else {
            var67 = [0.0, 1.0];
        }
    } else {
        var67 = [1.0, 0.0];
    }
    var var68;
    if (input[1] <= 149.5) {
        var68 = [0.0, 1.0];
    } else {
        var68 = [1.0, 0.0];
    }
    var var69;
    if (input[1] <= 149.5) {
        var69 = [0.0, 1.0];
    } else {
        var69 = [1.0, 0.0];
    }
    var var70;
    if (input[0] <= 129.5) {
        var70 = [1.0, 0.0];
    } else {
        var70 = [0.0, 1.0];
    }
    var var71;
    if (input[0] <= 129.5) {
        var71 = [1.0, 0.0];
    } else {
        var71 = [0.0, 1.0];
    }
    var var72;
    if (input[1] <= 149.5) {
        var72 = [0.0, 1.0];
    } else {
        var72 = [1.0, 0.0];
    }
    var var73;
    if (input[0] <= 129.5) {
        var73 = [1.0, 0.0];
    } else {
        var73 = [0.0, 1.0];
    }
    var var74;
    if (input[2] <= 130.0) {
        var74 = [0.0, 1.0];
    } else {
        var74 = [1.0, 0.0];
    }
    var var75;
    if (input[1] <= 149.5) {
        var75 = [0.0, 1.0];
    } else {
        var75 = [1.0, 0.0];
    }
    var var76;
    if (input[0] <= 129.5) {
        var76 = [1.0, 0.0];
    } else {
        var76 = [0.0, 1.0];
    }
    var var77;
    if (input[2] <= 129.5) {
        var77 = [0.0, 1.0];
    } else {
        var77 = [1.0, 0.0];
    }
    var var78;
    if (input[2] <= 129.5) {
        var78 = [0.0, 1.0];
    } else {
        var78 = [1.0, 0.0];
    }
    var var79;
    if (input[4] <= 49.5) {
        var79 = [1.0, 0.0];
    } else {
        var79 = [0.0, 1.0];
    }
    var var80;
    if (input[4] <= 49.5) {
        var80 = [1.0, 0.0];
    } else {
        var80 = [0.0, 1.0];
    }
    var var81;
    if (input[4] <= 49.5) {
        var81 = [1.0, 0.0];
    } else {
        var81 = [0.0, 1.0];
    }
    var var82;
    if (input[0] <= 129.5) {
        var82 = [1.0, 0.0];
    } else {
        var82 = [0.0, 1.0];
    }
    var var83;
    if (input[0] <= 130.0) {
        var83 = [1.0, 0.0];
    } else {
        var83 = [0.0, 1.0];
    }
    var var84;
    if (input[4] <= 49.5) {
        var84 = [1.0, 0.0];
    } else {
        var84 = [0.0, 1.0];
    }
    var var85;
    if (input[3] <= 19.5) {
        if (input[0] <= 129.0) {
            var85 = [1.0, 0.0];
        } else {
            var85 = [0.0, 1.0];
        }
    } else {
        var85 = [1.0, 0.0];
    }
    var var86;
    if (input[4] <= 49.5) {
        var86 = [1.0, 0.0];
    } else {
        var86 = [0.0, 1.0];
    }
    var var87;
    if (input[0] <= 129.5) {
        var87 = [1.0, 0.0];
    } else {
        var87 = [0.0, 1.0];
    }
    var var88;
    if (input[0] <= 130.0) {
        var88 = [1.0, 0.0];
    } else {
        var88 = [0.0, 1.0];
    }
    var var89;
    if (input[4] <= 49.5) {
        var89 = [1.0, 0.0];
    } else {
        var89 = [0.0, 1.0];
    }
    var var90;
    if (input[1] <= 149.5) {
        var90 = [0.0, 1.0];
    } else {
        var90 = [1.0, 0.0];
    }
    var var91;
    if (input[1] <= 149.5) {
        var91 = [0.0, 1.0];
    } else {
        var91 = [1.0, 0.0];
    }
    var var92;
    if (input[1] <= 149.5) {
        var92 = [0.0, 1.0];
    } else {
        var92 = [1.0, 0.0];
    }
    var var93;
    if (input[4] <= 49.5) {
        var93 = [1.0, 0.0];
    } else {
        var93 = [0.0, 1.0];
    }
    var var94;
    if (input[4] <= 49.5) {
        var94 = [1.0, 0.0];
    } else {
        var94 = [0.0, 1.0];
    }
    var var95;
    if (input[0] <= 129.5) {
        var95 = [1.0, 0.0];
    } else {
        var95 = [0.0, 1.0];
    }
    var var96;
    if (input[1] <= 149.5) {
        var96 = [0.0, 1.0];
    } else {
        var96 = [1.0, 0.0];
    }
    var var97;
    if (input[4] <= 49.5) {
        var97 = [1.0, 0.0];
    } else {
        var97 = [0.0, 1.0];
    }
    var var98;
    if (input[2] <= 129.5) {
        var98 = [0.0, 1.0];
    } else {
        var98 = [1.0, 0.0];
    }
    var var99;
    if (input[0] <= 129.5) {
        var99 = [1.0, 0.0];
    } else {
        var99 = [0.0, 1.0];
    }
    return mulVectorNumber(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(addVectors(var0, var1), var2), var3), var4), var5), var6), var7), var8), var9), var10), var11), var12), var13), var14), var15), var16), var17), var18), var19), var20), var21), var22), var23), var24), var25), var26), var27), var28), var29), var30), var31), var32), var33), var34), var35), var36), var37), var38), var39), var40), var41), var42), var43), var44), var45), var46), var47), var48), var49), var50), var51), var52), var53), var54), var55), var56), var57), var58), var59), var60), var61), var62), var63), var64), var65), var66), var67), var68), var69), var70), var71), var72), var73), var74), var75), var76), var77), var78), var79), var80), var81), var82), var83), var84), var85), var86), var87), var88), var89), var90), var91), var92), var93), var94), var95), var96), var97), var98), var99), 0.01);
}
function addVectors(v1, v2) {
    var result = new Array(v1.length);
    for (var i = 0; i < v1.length; i++) {
        result[i] = v1[i] + v2[i];
    }
    return result;
}
function mulVectorNumber(v1, num) {
    var result = new Array(v1.length);
    for (var i = 0; i < v1.length; i++) {
        result[i] = v1[i] * num;
    }
    return result;
}

export { score };
