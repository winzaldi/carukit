'user strict';

angular.module('carukit.services', [])


        .factory('RSServices', function ($cordovaSQLite) {

            var listRs = [{kode: 3173073, nama: 'Islam Jakarta', jenis: 'Rumah Sakit Umum', alamat: 'Jl. Cempaka Putih Tengah I / 1, Cempaka Putih Timur', koordinat_lbs: '-6.17036419,106.87034637', telpon: "021 42801567, 021 4250451", fax: "021 4206681", website: "www.rsi.co.id", email: "rsijpusat@rsi.co.id"},
                {kode: 3173474, nama: 'Pertamina Jaya', jenis: 'Rumah Sakit Umum', alamat: 'Jl. Achmad Yani No. 2, By Pass, Cempaka Putih Timur', koordinat_lbs: '-6.1731876,106.8760676', telpon: "021 4211911", fax: "021 4211913", website: "", email: "Mailbis rspj@yahoo.com"},
                {kode: 3173521, nama: 'Tarakan', jenis: 'Rumah Daerah', alamat: 'Jl. Kyai Caringin No. 7 , Cideng , Gambir', koordinat_lbs: '-6.17156, 106.810219', telpon: "021 3503003, 021 3508993", fax: "021 3503412", website: "", email: "rsd_tarakan@yahoo.co.id"},
                {kode: 3173656, nama: 'Mitra Kemayoran', jenis: 'Rumah Sakit Umum', alamat: 'Jl. Landas Pacu Timur, Kebon Kosong, Kemayoran', koordinat_lbs: '-6.151965,106.8585417', telpon: "021 6545555", fax: "021 6545959", website: "", email: "kemayoran@mitrakeluarga.com, mgrmedis.kmy@mitrakeluarga.com"},
                {kode: 3173063, nama: 'PGI Cikini', jenis: 'Rumah Sakit Umum', alamat: 'Jl. Raden Saleh No. 40 ,Cikini , Menteng', koordinat_lbs: '-6.1913613,106.8420008', telpon: "021 38997777", fax: "021 31924663", website: "", email: "marketing@rscikini.com"},
                {kode: 3174543, nama: 'Abdi Waluyo', jenis: 'Rumah Sakit Umum', alamat: 'Jl. HOS Cokroaminoto No. 31 - 33, Gondangdia, Menteng', koordinat_lbs: '-6.189849,106.8293106', telpon: "021 3144989", fax: "021 31930866", website: "", email: "dr.migot@yahoo.co.id"},
                {kode: 3173660, nama: 'Menteng Mitra Afia', jenis: 'Rumah Umum', alamat: 'Jl. Kali Pasir  No. 9, Kebon Siri, Menteng', koordinat_lbs: '-6.1870229,106.8383797', telpon: "021 3154050", fax: "021 3146309", website: "www.rsmentengmitraafia.com", email: "info@rsmentengmitraafia.com"},
                {kode: 3173040, nama: 'Husada ', jenis: 'Rumah Umum', alamat: 'Jl. Raya Mangga Besar Raya 137 / 139, Mangga Dua Selatan', koordinat_lbs: '-6.1476708,106.8293535', telpon: "021 6260208, 021 6490090", fax: "021 6497494", website: "www.husada.co.id", email: "husada@husada.co.id"},
                {kode: 3173014, nama: 'Dr. Cipto Mangunkusumo', jenis: 'Rumah Sakit Pusat Nasional', alamat: 'Jl. Diponegoro No. 71, Kenari, Senen', koordinat_lbs: '-6.1970288,106.8467199', telpon: "021 391830113, 021 3918301", fax: "021 3148991", website: "www.rscm.co.id", email: "info@rscm.co.id"},
                {kode: 3173084, nama: 'Moh. Ridwan Meuraksa', jenis: 'Rumah Sakit Umum', alamat: 'Jl. Kramat Raya No. 17 A, Kenari , Senen', koordinat_lbs: '-6.1913779,106.8473036', telpon: "021 3150535, 021 323094", fax: "021 3916888", website: "", email: ""}];
//                {kode: 1234, nama: 'Rumah Sakit 3'},
//                {kode: 1234, nama: 'Rumah Sakit 4'},
//                {kode: 1234, nama: 'Rumah Sakit 5'},
//                {kode: 1234, nama: 'Rumah Sakit 6'},
//                {kode: 1234, nama: 'Rumah Sakit 7'},
//                {kode: 1234, nama: 'Rumah Sakit 8'},
//                {kode: 1234, nama: 'Rumah Sakit 9'},
//                {kode: 1234, nama: 'Rumah Sakit 10'},
//                {kode: 1234, nama: 'Rumah Sakit 11'},
//                {kode: 1234, nama: 'Rumah Sakit 12'},
//                {kode: 1234, nama: 'Rumah Sakit 13'},
//                {kode: 1234, nama: 'Rumah Sakit 14'},
//                {kode: 1234, nama: 'Rumah Sakit 15'},
//                {kode: 1234, nama: 'Rumah Sakit 116'},
//                {kode: 1234, nama: 'Rumah Sakit 17'},
//                {kode: 1234, nama: 'Rumah Sakit 18'},
//                {kode: 1234, nama: 'Rumah Sakit 19'},
//                {kode: 1234, nama: 'Rumah Sakit 20'}];


            return {
                getAll: function () {
                    var recordRs = [];
                    var db = $cordovaSQLite.openDB(({name: "hospital.db.sqlite", location: 'default'}));
                    var query = "SELECT kode,nama,jenis,alamat,koordinat_lbs FROM T_RUMAH_SAKIT ";
                    $cordovaSQLite.execute(db, query, []).then(function (res) {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log("SELECTED -> " + res.rows.item(i).kode + " " + res.rows.item(i).nama);
                                console.log({kode: res.rows.item(i).kode, nama: res.rows.item(i).nama});
                                recordRs.push({
                                    kode: res.rows.item(i).kode,
                                    nama: res.rows.item(i).nama,
                                    jenis: res.rows.item(i).jenis,
                                    alamat: res.rows.item(i).alamat,
                                    koordinat_lbs: res.rows.item(i).koordinat_lbs
                                });
                                //console.log(">>> " + JSON.stringify(res.rows.item(i), null, 4));
                            }
                        } else {
                            console.log("No results found");
                        }
                    }, function (err) {
                        console.error(err);
                    });
                    return recordRs;
                },
                getAllStatic: function () {
                    return listRs;
                },
                get: function (kode) {
                    for (var i = 0; i < listRs.length; i++) {
                        if (listRs[i].kode === parseInt(kode)) {
                            return listRs[i];
                        }
                    }
                    return null;
                }
//                ,
//                getRs: function (kode) {
//                    var result = [];
//                    var db = $cordovaSQLite.openDB(({name: "hospital.db.sqlite", location: 'default'}));
//                    var query = "SELECT kode,nama,jenis,alamat,koordinat_lbs FROM T_RUMAH_SAKIT WHERE kode = ?";
//                    $cordovaSQLite.execute(db, query, [kode]).then(function (res) {
//                        if (res.rows.length > 0) {
//                            console.log("SELECTED -> " + res.rows.item(0).kode + " " + res.rows.item(0).nama);
//                            console.log(JSON.stringify({kode: res.rows.item(0).kode, nama: res.rows.item(0).nama}));
//                            result.push({
//                                kode: res.rows.item(0).kode,
//                                nama: res.rows.item(0).nama,
//                                jenis: res.rows.item(0).jenis,
//                                alamat: res.rows.item(0).alamat,
//                                koordinat_lbs: res.rows.item(0).koordinat_lbs
//                            });
//                            console.log(JSON.stringify(result));
//                            return result;
//                        } else {
//                            console.log("No Single Results Found");
//                        }
//                    }, function (err) {
//                        console.error(err);
//                    });
//                    console.log("JSON.stringify(result)||");
//                    console.log(JSON.stringify(result));
//                    return result;
//                }
            }
        })
        .factory('httpService', function ($http) {
            var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&travelMode=DRIVING&";
            var API_KEY = "AIzaSyDFberVyWaVDCxFLaRxYLxUuSd4uPb_I2s";
            return {
                calculateDistance: function (origin, destination) {
                    return $http.get(url + "&origins=" + origin + "&destinations=" + destination + "&key=" + API_KEY)
                            .success(function (data) {
                                console.log("success" + data);
                            })
                            .error(function (data) {
                                console.log(destination + "|" + data);
                            })
                }
            }
        });
