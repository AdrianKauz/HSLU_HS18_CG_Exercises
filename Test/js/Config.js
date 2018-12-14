export function Config() {
    this.orbitalObjects = {
        sun : {
            object : {
                diameter : 41879000, // Real value: 1391016000
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
        earthClouds : {
            object : {
                diameter : 12937000,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.15, 0.0]
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
                orientation : [-Math.PI/1.8, 0.0, 0.0],
                rotationVelocity : [0.0, 0.1, 0.0]
            },
            orbit : {
                velocity : 4698.076356048,
                inclination : 1.305,
                radius : 778500000000
            }
        },
        jupiterIo : {
            object : {
                diameter : 3643200,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 1.769,
                inclination : 0.04,
                radius : 230900000000
            }
        },
        jupiterEuropa : {
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
        jupiterGanymede : {
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
        jupiterCallisto : {
            object : {
                diameter : 4820600,
                orientation : [-Math.PI/1.9, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 16.689,
                inclination : 20.00,
                radius : 870400000000
            }
        },
        saturn : {
            object : {
                diameter : 120500000,
                orientation : [-Math.PI/3, 0.0, 0.0],
                rotationVelocity : [0.0, 0.2, 0.0]
            },
            orbit : {
                velocity : 10759.356685008828,
                inclination : 2.484,
                radius : 1430000000000
            }
        },
        saturnRing : {
            object : {
                diameter : 0.0,
                orientation : [Math.PI/0.87, 0.0, 0.0],
                rotationVelocity : [0.0, 0.0, 0.0]
            },
            orbit : {
                velocity : 0.0,
                inclination : 0.0,
                radius : 0.0
            }
        },
    };

    this.dimensions = {
        object : 0.000000005,
        radius : 0.000000000003,
        sydericPeriod : 365.256363004,
        orbitalPeriodSimulation : 300 // Value in Seconds
    }

}