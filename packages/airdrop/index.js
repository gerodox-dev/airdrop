
// REQUIRES

const api = require("../../api");
const mysql = require("../../modules/mysql");

// CODE

let airdrop = {};

airdrop.status = false;

airdrop.invervalCheck = null;
airdrop.invervalDown = null;

airdrop.updateTimeCheck = 2; // Указывать в реальных минутах
airdrop.blocked = false; // Управляет блокировкой ящика (если стоит true то он никогда не упадет)
airdrop.status = false; // Статус ящика (если стоит true то - падает, иначе нет)

airdrop.list_position = [];

airdrop.parachuteZ = [];
airdrop.boxZ = [];

airdrop.loadAll = function() {
    mysql.executeQueryInvisible(`SELECT * FROM \`airdrop\``, (err, rows, fields) => {
        if(rows) {
            rows.forEach(airdropData => {
                let arrayData = {
                    id: Number(airdropData.id),

                    position: {
                        x: Number(airdropData.x),
                        y: Number(airdropData.y),
                        z: Number(airdropData.z) + Number(50)
                    },

                    parachuteZ: Number(airdropData.z) + Number(54.75),
                    boxZ: Number(airdropData.z) - Number(1)
                };

                this.list_position.push(arrayData);
            });
        }
    });

    mp.events.addCommand('airdrop', (player) => {
        let randomAirDrop = api.methods.getRandomInt(0, Number(this.list_position.length));

        mp.players.forEach(playerData => {
            playerData.notify('~y~Через 15 секунд упадет военный ящик');
        });

        this.start(this.list_position[randomAirDrop]);
    });

    this.invervalCheck = setInterval(() => {this.test();}, 20000);
    api.methods.info(0, 'Система военных ящиков загружена');

    this.status = true;
};

airdrop.test = function() {
    let date = new Date();

    if(this.blocked === false) {
        this.blocked = true;

        if(date.getHours() === 4 || date.getHours() === 9 || date.getHours() === 13 || date.getHours() === 19) {
            this.starting();
            return false;
        } else {
            this.blocked = true;
            this.status = false;
        }
    }
};

airdrop.starting = function() {
    console.log('Запуск 2..');
    this.status = false;

    // if(this.blocked === false && this.invervalDown === null && this.status === false) {
        // Устанавливаем статус ящика
        this.status = true;
        this.blocked = true;

        if(this.invervalDown === null) {
            // Ящик упадет через 15 минут, оповещения приходят в начале падения, спустя 10 минут, 5 минут, 2 минуты, 1 минуту и 15 секунд
            mp.players.forEach(playerData => {
                playerData.notify('~y~Через 15 минут упадет военный ящик');
            });
            

            // TODO Нужно бы доделать/переделать
            setTimeout(() => {
                mp.players.forEach(playerData => {
                    playerData.notify('~y~Через 10 минут упадет военный ящик');

                    setTimeout(() => {
                        mp.players.forEach(playerData => {
                            playerData.notify('~y~Через 5 минут упадет военный ящик');
                        });

                        setTimeout(() => {
                            mp.players.forEach(playerData => {
                                playerData.notify('~y~Через 2 минуты упадет военный ящик');
                            });

                            setTimeout(() => {
                                mp.players.forEach(playerData => {
                                    playerData.notify('~y~Через 1 минуту упадет военный ящик');
                                });

                                setTimeout(() => {
                                    // Рандомным способом выбираем ящик
                                    let randomAirDrop = api.methods.getRandomInt(0, Number(this.list_position.length));

                                    mp.players.forEach(playerData => {
                                        playerData.notify('~y~Через 15 секунд упадет военный ящик');
                                    });

                                    this.start(this.list_position[randomAirDrop]);
                                }, 15000);
                            }, 60000);
                        }, 180000);
                    }, 300000);
                });
            }, 300000);
        }
    // }
}

airdrop.start = function(item) {
    console.log(item);

    let boxBlip = mp.blips.new(478, new mp.Vector3(item.position.x, item.position.y, item.boxZ),{
        name: 'Военный ящик',
        scale: 0.65,
        color: 10,
        alpha: 255,
        drawDistance: 50,
        shortRange: false,
        rotation: 0,
        dimension: 0,
        radius: 0,
    });

    // Создаем объекты
    let box = mp.objects.new('prop_air_cargo_04a', new mp.Vector3(item.position.x, item.position.y, item.position.z), {
        rotation: new mp.Vector3(0, 0, 0),
        alpha: 255,
        dimension: 0
    });

    let parachute = mp.objects.new('p_parachute1_mp_dec', new mp.Vector3(item.position.x, item.position.y, item.parachuteZ), {
        rotation: new mp.Vector3(0, 0, 0),
        alpha: 255,
        dimension: 0
    });

    // Сохраняем данные Z
    this.parachuteZ = Number(item.position.z) - Number(14.75);
    this.boxZ = Number(item.position.z) - Number(10);

    this.invervalDown = setInterval(() => {
        box.position = new mp.Vector3(item.position.x, item.position.y, item.position.z -= 0.01);
        parachute.position = new mp.Vector3(item.position.x, item.position.y, item.parachuteZ -= 0.01);

        if(Number(box.position.z) <= Number(item.boxZ)) {
            clearInterval(this.invervalDown);
            this.invervalDown = null;

            parachute.destroy();
            setTimeout(() => {
                box.destroy();
                boxBlip.destroy();
                this.status = false;

                clearInterval(audio);
                audio = null;
            }, 5000);
        }

        console.log(box.position.z);
    }, 35);

    let audio = setInterval(() => {
        mp.players.call('client.AirDropAudio', [true, box]);
    }, 1000);
};

airdrop.getStatus = function() {
    return this.status;
}

module.exports = airdrop;