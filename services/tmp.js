    var myself = this;

    myself.originalInit(globals);

    myself.arduino = {
        board : undefined,	// Reference to arduino board - to be created by new firmata.Board()
        connecting : false,	// Flag to avoid multiple attempts to connect
        disconnecting : false,  // Flag to avoid serialport communication when it is being closed
        justConnected: false,	// Flag to avoid double attempts
        keepAliveIntervalID: null,
        hostname : 'esp8266.local:23' // Default hostname and port for network connection
    };

    // This function just asks for the version and checks if we've received it after a timeout
    myself.arduino.keepAlive = function() {
        if (world.Arduino.keepAlive) {
            if (myself.arduino.board.version.major !== undefined) {
                // Everything looks fine, let's try again
                myself.arduino.board.version = {};
                myself.arduino.board.reportVersion(nop);
            } else {
                // Connection dropped! Let's disconnect!
                myself.arduino.disconnect(); 
            }
        }
    }

    myself.arduino.disconnect = function(silent) {

        if (this.isBoardReady()) {
            // Prevent disconnection attempts before board is actually connected
            this.disconnecting = true;
            if (this.port === 'network') {
                this.board.sp.destroy();
            } else {
                this.board.sp.close();
            }
            this.closeHandler(silent);
        } else if (!this.board) {
            // Don't send info message if the board has been connected
            if (!silent) {
                ide.inform(myself.name, localize('Board is not connected'))
            }
        } 
    }

    // This should belong to the IDE
    myself.arduino.showMessage = function(msg) {
        if (!this.message) { this.message = new DialogBoxMorph() };

        var txt = new TextMorph(
                msg,
                this.fontSize,
                this.fontStyle,
                true,
                false,
                'center',
                null,
                null,
                MorphicPreferences.isFlat ? null : new Point(1, 1),
                new Color(255, 255, 255)
                );

        if (!this.message.key) { this.message.key = 'message' + myself.name + msg };

        this.message.labelString = myself.name;
        this.message.createLabel();
        if (msg) { this.message.addBody(txt) };
        this.message.drawNew();
        this.message.fixLayout();
        this.message.popUp(world);
        this.message.show();
    }

    myself.arduino.hideMessage = function() {
        if (this.message) {
            this.message.cancel();
            this.message = null;
        }
    }

    myself.arduino.attemptConnection = function () {
        if (!this.connecting) {
            if (this.board === undefined) {
                // Get list of ports (Arduino compatible)
                var ports = world.Arduino.getSerialPorts(function(ports) {
                    var portMenu = new MenuMorph(this, 'select a port');
                    if (Object.keys(ports).length >= 1) {
                        Object.keys(ports).forEach(function(each) {
                            portMenu.addItem(each, function() { 
                                myself.arduino.connect(each);
                            })
                        });
                        portMenu.addLine();
                    }
                    portMenu.addItem('Network port', function() {
                        myself.arduino.networkDialog();
                    });
                    portMenu.popUpAtHand(world);
                });
            } else {
                ide.inform(myself.name, localize('There is already a board connected to this sprite'));
            }
        }

        if (this.justConnected) {
            this.justConnected = undefined;
            return;
        }
    };

    myself.arduino.closeHandler = function (silent) {

        var portName = 'unknown',
            thisArduino = myself.arduino;

        if (thisArduino.board) {
            portName = thisArduino.board.sp.path;
            
            thisArduino.board.sp.removeListener('disconnect', thisArduino.disconnectHandler);
            thisArduino.board.sp.removeListener('close', thisArduino.closeHandler);
            thisArduino.board.sp.removeListener('error', thisArduino.errorHandler);

            thisArduino.board = undefined;
        };

        clearInterval(thisArduino.keepAliveIntervalID);

        world.Arduino.unlockPort(thisArduino.port);
        thisArduino.connecting = false;
        thisArduino.disconnecting = false;

        if (thisArduino.disconnected & !silent) {
            ide.inform(
                    myself.name,
                    localize('Board was disconnected from port\n') 
                    + portName 
                    + '\n\nIt seems that someone pulled the cable!');
            thisArduino.disconnected = false;
        } else if (!silent) {
            ide.inform(myself.name, localize('Board was disconnected from port\n') + portName);
        }
    };

    myself.arduino.disconnectHandler = function () {
        // This fires up when the cable is unplugged
        myself.arduino.disconnected = true;
    };

    myself.arduino.errorHandler = function (err) {
        ide.inform(
                myself.name,
                localize('An error was detected on the board\n\n')
                + err,
                myself.arduino.disconnect(true));
    };

    myself.arduino.networkDialog = function () {
        new DialogBoxMorph(
            this, // target
            'connectNetwork', // action
            this // environment
        ).prompt(
            "Enter hostname or ip address:", // title
            myself.arduino.hostname, // default
            myself.world() // world
        );
    };

    myself.arduino.connectNetwork = function (host) {
        var net = require('net'),
            hostname = host.split(':')[0],
            port = host.split(':')[1] ? ':' + host.split(':')[1] : '';

        myself.arduino.hostname = hostname + port;

        this.disconnect(true);

        this.showMessage(localize('Connecting to network port:\n' + myself.arduino.hostname + '\n\n' + localize('This may take a few seconds...')));
        this.connecting = true;

        var client = net.connect(
                { 
                    host: hostname,
                    port: port
                },
                function () {
                    var socket = this;
                    myself.arduino.board = new world.Arduino.firmata.Board(socket, function(err) {
                        if (!err) {
                            // Clear timeout to avoid problems if connection is closed before timeout is completed
                            clearTimeout(myself.arduino.connectionTimeout);

                            // Start the keepAlive interval
                            myself.arduino.keepAliveIntervalID = setInterval(myself.arduino.keepAlive, 5000);

                            myself.arduino.board.sp.on('disconnect', myself.arduino.disconnectHandler);
                            myself.arduino.board.sp.on('close', myself.arduino.closeHandler);
                            myself.arduino.board.sp.on('error', myself.arduino.errorHandler);

                            myself.arduino.port = 'network';
                            myself.arduino.connecting = false;
                            myself.arduino.justConnected = true;
                            myself.arduino.board.connected = true;
                            myself.arduino.board.sp.path = myself.arduino.hostname;

                            myself.arduino.hideMessage();
                            ide.inform(myself.name, localize('An Arduino board has been connected. Happy prototyping!'));
                        } else {
                            myself.arduino.hideMessage();
                            ide.inform(myself.name, localize('Error connecting the board.\n') + err, myself.arduino.closeHandler(true));
                        }
                        return;
                    });
        });

        client.on('error', function(err) {
            myself.arduino.hideMessage();
            if (err.code === 'EHOSTUNREACH') {
                ide.inform(
                        myself.name, 
                        localize('Unable to connect to board\n')
                        + myself.arduino.hostname + '\n\n'
                        + localize('Make sure the board is powered on'));
            } else if (err.code === 'ECONNREFUSED') {
                ide.inform(
                        myself.name,
                        localize('Unable to connect to board\n')
                        + myself.arduino.hostname + '\n\n'
                        + localize('Make sure the hostname and port are correct'));
            } else {
                ide.inform(myself.name, localize('Unable to connect to board\n') + myself.arduino.hostname);
            }
            client.destroy();
            myself.arduino.connecting = false;
            myself.arduino.justConnected = false;
        });
    };

    myself.arduino.connect = function(port) {
        this.disconnect(true);

        this.showMessage(localize('Connecting board at port\n') + port);
        this.connecting = true;

        this.board = new world.Arduino.firmata.Board(port, function(err) { 
            if (!err) { 

                // Clear timeout to avoid problems if connection is closed before timeout is completed
                clearTimeout(myself.arduino.connectionTimeout); 

                // Start the keepAlive interval
                myself.arduino.keepAliveIntervalID = setInterval(myself.arduino.keepAlive, 5000);

                myself.arduino.board.sp.on('disconnect', myself.arduino.disconnectHandler);
                myself.arduino.board.sp.on('close', myself.arduino.closeHandler);
                myself.arduino.board.sp.on('error', myself.arduino.errorHandler);

                world.Arduino.lockPort(port);
                myself.arduino.port = myself.arduino.board.sp.path;
                myself.arduino.connecting = false;
                myself.arduino.justConnected = true;
                myself.arduino.board.connected = true;

                myself.arduino.hideMessage();
                ide.inform(myself.name, localize('An Arduino board has been connected. Happy prototyping!'));   
            } else {
                myself.arduino.hideMessage();
                ide.inform(myself.name, localize('Error connecting the board.') + ' ' + err, myself.arduino.closeHandler(true));
            }
            return;
        });

        // Set timeout to check if device does not speak firmata (in such case new Board callback was never called, but board object exists) 
        myself.arduino.connectionTimeout = setTimeout(function() {
            // If !board.versionReceived, the board has not established a firmata connection
            if (myself.arduino.board && !myself.arduino.board.versionReceived) {
                var port = myself.arduino.board.sp.path;

                myself.arduino.hideMessage();
                ide.inform(
                        myself.name,
                        localize('Could not talk to Arduino in port\n')
                        + port + '\n\n' + localize('Check if firmata is loaded.')
                        );

            // silently closing the connection attempt
            myself.arduino.disconnect(true); 
            }
        }, 10000);
    };

    myself.arduino.isBoardReady = function() {
        return ((this.board !== undefined) 
                && (this.board.pins.length>0) 
                && (!this.disconnecting));
    };
};