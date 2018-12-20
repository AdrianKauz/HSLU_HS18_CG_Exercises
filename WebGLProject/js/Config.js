export function Config() {
    this.orbitalObjects = {
        sun : {
            object : {
                diameter : 139101600, // Real value: 1391016000
                orientation : [Math.PI, 0.0, 0.0],
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
                orientation : [Math.PI / 1.1, 0.0, 0.0],
                rotationVelocity : [0.3, 0.0, 0.0]
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
                orientation : [Math.PI / 1.1, 0.0, 0.0],
                rotationVelocity : [0.05, 0.0, 0.0]
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
                orientation : [Math.PI / 1.1, 0.0, 0.0],
                rotationVelocity : [0.2, 0.0, 0.0]
            },
            orbit : {
                velocity : 365.256363004,
                inclination : 3.395,
                radius : 149600000000
            }
        },
        earthClouds : {
            object : {
                diameter : 12937000,
                orientation : [Math.PI / 1.1, 0.0, 0.0],
                rotationVelocity : [0.15, 0.0, 0.0]
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
                orientation : [Math.PI / 1.1, Math.PI, 0.0],
                rotationVelocity : [0.2, 0.0, 0.0]
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
                orientation : [Math.PI / 1.1, 0.0, 0.0],
                rotationVelocity : [0.3, 0.0, 0.0]
            },
            orbit : {
                velocity : 779.94,
                inclination : 1.850,
                radius : 227900000000
            }
        },
        jupiter : {
            object : {
                diameter : 139822000,
                orientation : [Math.PI / 1.1, 0.0, 0.0],
                rotationVelocity : [0.1, 0.0, 0.0]
            },
            orbit : {
                velocity : 398.88,
                inclination : 1.305,
                radius : 778500000000
            }
        },
        jupiterMonolith : {
            object : {
                diameter : 0.0,
                orientation : [Math.PI / 2, Math.PI/2, 0.0],
                rotationVelocity : [0.1, 0.0, 0.0]
            },
            orbit : {
                velocity : 100.076356048,
                inclination : 170.0,
                radius : 50900000000
            }
        },
        jupiterIo : {
            object : {
                diameter : 3643200,
                orientation : [-Math.PI / 1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 1.769,
                inclination : 0.04,
                radius : 130900000000
            }
        },
        jupiterEuropa : {
            object : {
                diameter : 3122000,
                orientation : [-Math.PI / 1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 3.551,
                inclination : 0.470,
                radius : 170900000000
            }
        },
        jupiterGanymede : {
            object : {
                diameter : 5268000,
                orientation : [-Math.PI / 1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 7.155,
                inclination : 2.18,
                radius : 270400000000
            }
        },
        jupiterCallisto : {
            object : {
                diameter : 4820600,
                orientation : [-Math.PI / 1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 16.689,
                inclination : 20.00,
                radius : 370400000000
            }
        },
        saturn : {
            object : {
                diameter : 120500000,
                orientation : [Math.PI / 0.9, 0.0, 0.0],
                rotationVelocity : [0.2, 0.0, 0.0]
            },
            orbit : {
                velocity : 378.09,
                inclination : 2.484,
                radius : 1430000000000
            }
        },
        saturnRing : {
            object : {
                diameter : 0.0,
                orientation : [Math.PI / 1.6, 0.0, 0.0],
                rotationVelocity : [0.0, 0.0, 0.0]
            },
            orbit : {
                velocity : 378.09,
                inclination : 0.0,
                radius : 0.0
            }
        },
        uranus : {
            object : {
                diameter : 50724000,
                orientation : [Math.PI / 2.1, 0.0, 0.0],
                rotationVelocity : [0.2, 0.0, 0.0]
            },
            orbit : {
                velocity : 369.66,
                inclination : 0.770,
                radius : 2830000000000
            }
        },
        uranusRing : {
            object : {
                diameter : 0.0,
                orientation : [-0.1, 0.0, 0.0],
                rotationVelocity : [0.0, 0.0, 0.0]
            },
            orbit : {
                velocity : 369.66,
                inclination : 0.0,
                radius : 0.0
            }
        },
        neptune : {
            object: {
                diameter: 49244000,
                orientation: [Math.PI / 0.9, 0.0, 0.0],
                rotationVelocity: [0.2, 0.0, 0.0]
            },
            orbit: {
                velocity: 367.49,
                inclination: 1.769,
                radius : 4030000000000
            }
        }
    };

    this.dimensions = {
        object : 0.000000002,
        radius : 0.000000000003,
        sydericPeriod : 365.256363004,
        orbitalPeriodSimulation : 300 // Value in Seconds
    }

}