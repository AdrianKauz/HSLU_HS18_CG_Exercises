export function Config() {
    this.orbitalObjects = {
        sun : {
            object : {
                diameter : 31879000, // Real value: 1391016000
                orientation : [-Math.PI/2, 0.0, 0.0],
                rotationVelocity : [0.02, 0.02, 0.02]
            },
            orbit : {
                velocity : 0.0,
                inclination : 0.0,
                radius : 0.0
            }
        },
        mercury : {
            object : {
                diameter : 4879000,
                orientation : [-Math.PI/2, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 115.88,
                inclination : 7.00487,
                radius : 57910000000
            }
        },
        venus : {
            object : {
                diameter : 12104000,
                orientation : [-Math.PI/2, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 583.92,
                inclination : 3.395,
                radius : 108000000000
            }
        },
        earth : {
            object : {
                diameter : 12742000,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 365.256363004,
                inclination : 3.395,
                radius : 149600000000
            }
        },
        moon : {
            object : {
                diameter : 3474000,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 27.322,
                inclination : 10.0,
                radius : 25000000000
            }
        },
        mars : {
            object : {
                diameter : 6779000,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 686.980,
                inclination : 1.850,
                radius : 227900000000
            }
        },
        jupiter : {
            object : {
                diameter : 139822000,
                orientation : [-Math.PI/1.6, 0.0, 0.0],
                rotationVelocity : [0.0, 0.1, 0.0]
            },
            orbit : {
                velocity : 4698.076356048,
                inclination : 1.305,
                radius : 778500000000
            }
        },
        europa : {
            object : {
                diameter : 3122000,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 3.551,
                inclination : 0.470,
                radius : 370900000000
            }
        },
        ganymede : {
            object : {
                diameter : 5268000,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 7.155,
                inclination : 2.18,
                radius : 470400000000
            }
        },
    };

    this.dimensions = {
        object : 0.00000001,
        radius : 0.0000000000050,
        sydericPeriod : 365.256363004,
        orbitalPeriodSimulation : 500 // Value in Seconds
    }

}