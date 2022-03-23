const wa = require("@open-wa/wa-automate");
var data = [];
var db = [];

wa.create({
  sessionId: "COVID_HELPER",
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: "PT_BR",
  logConsole: false,
  popup: true,
  qrTimeout: 0
}).then(client => start(client));

function start(client) {
  client.onMessage(async message => {
	if(message.body === "Arahkan Saya"){
        let centre = contactRandom([6287800541359, 6283863363040]);
	    await client.sendText(message.from, "Anda dalam antrian!\nMohon menunggu, Kami akan segera mengarahkan anda ...");
		setTimeout(() => {
			setConnect(message.from, centre + "@c.us");
            client.sendButtons(centre + "@c.us", "Anda terhubung dengan pengguna harap ditanggapi! Jika pelanggan bukan menanyakan pertanyaan, Harap perintahkan *Disconnect*.",
            [{
		        "id": "0",
				"text": "Disconnect"			  
			}], "Status: Connect", "Terhubung dengan wa.me/" + message.from.split("@")[0]);
			client.sendButtons(message.from, "Anda terhubung dengan Centre! Anda sekarang bisa kirim pesan disini.\n\nJika ingin mengakhiri sesi chat, Anda dapat memilih tombol *Disconnect* pada tombol dibawah ini.", 
			[{
				"id": "0",
				"text": "Disconnect"			  
			}], "Status: Connect", "Terhubung dengan Centre");
		}, 5000);
		return;
	}
	if(message.body === "Disconnect"){
		await client.sendText(message.from, "Pesan ke Centre telah diakhiri\nUntuk mengarahkan lagi bisa chat dan klik tombol *Arahkan Saya*.");
                await client.sendText(data[message.from], "_Pengguna telah mengakhiri sesi chat ini!_");
                setDisconnect(message.from, data[message.from]);
		return;
	}
	if(message.body === "Database Saya"){
		if(db[message.from]){
                        let key = message.from;
			client.sendText(message.from, "*Informasi Database Pengguna!*\n\n• Nomor: " + key.split("@")[0] + "\n• Nama: " + db[key]["name"] + "\n• Tabungan: " + db[key]["balance"]);
		}else{
			client.sendText(message.from, "Database anda tidak didaftarkan! Hubungi Centre klik tombol *Arahkan Saya* pada pesan pertama yang anda kirimkan!");
		}
		return;
	}
        if(message.body.split("@")[0] === "createGroup"){
            if(message.body.split("@").length === 1){
                await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\ncreateGroup@nama");
                return;
            }
            let group = message.body.split("@")[1];
            await client.createGroup(group, message.from);
            await client.sendText(message.from, "Group dengan nama *" + group + "* berhasil dibuat!");
            return;
        }
        if(message.body === "getGroupId"){
            if(message.from.split("@")[1] === "c.us"){
                await client.sendText(message.from, "Hanya bisa diakses digrub & jadikan bot ini sebagai admin digroup!");
                return;
            }
            await client.sendText(message.from, "Group ID: ```" + message.from.split("@")[0] + "```");
            return;
        }
        if(message.body.split("@")[0] === "addUser"){
            if(message.from.split("@")[1] === "g.us"){
                await client.sendText(message.from, "Hanya bisa diakses dipribadi & jadikan bot ini sebagai admin digroup!");
                return;
            }
            if(message.body.split("@").length === 1 || message.body.split("@").length === 2){
                await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\naddUser@grub_id@nomor");
                return;
            }
            let group = message.body.split("@")[1] + "@g.us";
            let sender = message.body.split("@")[2] + "@c.us";
            await client.addParticipant(group, sender);
            await client.sendText(message.from, message.body.split("@")[1] + " telah ditambahkan ke grub id " + message.body.split("@")[2] + ".");
            return;
        }
        if(message.body.split("@")[0] === "getDatabase"){
            if(!message.body === "6283863363040@c.us"){
                return;
	    }
            if(message.body.split("@").length === 1){
        	await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\ngetDatabase@nomor");
		return;
	    }
            let key = "";
            let type = message.body.split("@")[2];
            if(type === "group"){
                key = message.body.split("@")[1] + "@g.us";
            }else{
                key = message.body.split("@")[1] + "@c.us";
            }
            if(db[key]){
	        await client.sendText(message.from, "*Informasi Database Pengguna!*\n\n• Nomor: " + key.split("@")[0] + "\n• Nama: " + db[key]["name"] + "\n• Tabungan: " + db[key]["balance"]);
            }else{
	        await client.sendText(message.from, "*Error!*\n\nDatabase pengguna tersebut tidak didaftarkan.");
            }
            return;
        }
	if(message.body.split("@")[0] === "getCreate"){
		if(!message.body === "6283863363040@c.us"){
            return;
		}
		if(message.body.split("@").length === 1){
			await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\ngetCreate@nomor@nama");
			return;
		}
		if(message.body.split("@").length === 2){
			await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\ngetCreate@nomor@nama");
			return;
		}
                let key = "";
                let type = message.body.split("@")[3];
		let name = message.body.split("@")[2];
                if(type === "group"){
                    key = message.body.split("@")[1] + "@g.us";
                }else{
                    key = message.body.split("@")[1] + "@c.us";
                }
		if(!db[key]){
            createDatabase(key, name);
			await client.sendText(message.from, "*Sucess!*\n\n" + key + " database berhasil dibuat.");
		}else{
	         	await client.sendText(message.from, "*Error!*\n\nDatabase pengguna tersebut telah didaftarkan.");
                }
		return;
	}
	if(message.body.split("@")[0] === "getFormulir"){
		if(!message.body === "6283863363040@c.us"){
            return;
		}
		let key = message.body.split("@")[1] + "@c.us";
		if(message.body.split("@").length === 1){
			await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\ngetFormulir@nomor");
			return;
		}
		await client.sendText(key, "Harap isi formulir berikut!\n\nNama: \nJumlah: \n\nJumlah adalah balance yang diinginkan!\nSalin formulir ini dan isikan, lalu kirimkan disini!")
		return;
	}
	if(message.body.split("@")[0] == "createButton"){
                let sender = "";
		let text = message.body.split("@")[1];
		let button_text = message.body.split("@")[2];
                let type = message.body.split("@")[4];
                if(type === "group"){
                    sender = message.body.split("@")[3] + "@g.us";
                }else{
                    sender = message.body.split("@")[3] + "@c.us";
                }
		if(message.body.split("@").length === 1 || message.body.split("@").length === 2 || message.body.split("@").length === 3){
			await client.sendText(message.from, "*Format Salah!*\n\nContoh Penggunaan:\ncreateButton@pesan@teks_tombol@nomor");
			return;
		}
		await client.sendButtons(sender, text, [{
			"id": "0",
			"text": button_text
		}], "", "Pesan dibuat oleh EntityID!");
		await client.sendText(message.from, "Berhasil dikirimkan!");
		return;
	}
	if(data[message.from]){
		await client.sendText(data[message.from], message.body);
	}else{
            if(db[message.from]){
                await client.sendButtons(message.from, "Layanan chat otomatis, Ingin terhubung ke Centre?\nJika iya klik pada tombol dibawah *Arahkan Saya*.",
	        [{
			"id": "0",
                        "text": "Database Saya"			  
		}, {
			"id": "1",
			"text": "Arahkan Saya"
		}], "Selamat Datang diEntityID!", "By EntityID! - @Reza");
            }else{
                await client.sendButtons(message.from, "Layanan chat otomatis, Ingin terhubung ke Centre?\nJika iya klik pada tombol dibawah ini *Arahkan Saya*.",
                [{
                    "id": "0",
                    "text": "Arahkan Saya"
                }], "Selamat Datang diEntityID!", "By EntityID! - @Reza");
            }
	}
  });
}

function setConnect(from, to){
	data[from] = to;
	data[to] = from;
}

function setDisconnect(from, to){
	delete data[from];
	delete data[to]
}

function createDatabase(key, name){
	db[key] = {
        "name": name,
        "balance": 0
	};
}

function contactRandom(list){
    return list[Math.floor((Math.random() * list.length))];
}
