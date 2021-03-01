
var botao = 'horas';
var tempo = 24;
let tempoHora = 24
let tempoDia = 1
const setPointTempMax = 25
const setPointTempMin = 19
const setPointTempGeradorMax = 70
const setPointTempGeradorMin = 0
const setPointUmid = 75
const Pa_to_mmHg = 0.0075006157593005;
const GeradorName = "geradorcasa"
const GeradorName2 = "geradorpredio"
const lineThickness = 2;
const lineType = "line";
const labelFontSize = 10;
const backgroundColor = "#aaaaaa";
const GridColor = "#cococo";
const bacgroundGraph = "rgba(0,0,0,0.35)";
const fontColor = "black";
const opac1 = 1;
const markerType = "circle";
const toolTipConfig = {
    borderColor: "black",
    shared: true,
    cornerRadius: 7,
    fontSize: 16,
    backgroundColor: "#555555"
}
const Xaxis = {
    //interval: 30,
    //title: "Hora LOCAL",
    //titleFontSize: 15,
    //intervalType: "minute",
    gridColor: GridColor,
    lineDashType: "dot",
    valueFormatString: "DD/MMM/YY HH:mm:ss",
    labelAngle: -45,
    labelFontSize: 12,
    labelMaxWidth: 50, // change label width accordingly
    labelFontColor: fontColor,
    crosshair: {
        enabled: true,
        gridDashType: "dot",

    },
    gridThickness: 1,
    gridDashType: "dot",
    valueFormatString: "DD/MMM HH:mm:ss"
}



ultima_amostra = function (data) {
    let HoraGerador1 = new Date((data[GeradorName][0].timestamp - (3600 * 3)) * 1000).toISOString().slice(11, 19).replace('T', ' ');
    let HoraGerador2 = new Date((data[GeradorName2][0].timestamp - (3600 * 3)) * 1000).toISOString().slice(11, 19).replace('T', ' ');
    
    let temperaturaGeradorCasaAtual = data[GeradorName][0].temperatura_ar;
    let temperaturaGeradorPredioAtual = data[GeradorName2][0].temperatura_ar;
       
    let umidadeGeradorCasaAtual = data[GeradorName][0].umidade;
    let umidadeGeradorPredioAtual = data[GeradorName2][0].umidade;
        
    let pressaoGeradorCasaAtual = (data[GeradorName][0].pressao_local / 100);
    let pressaoGeradorPredioAtual = (data[GeradorName2][0].pressao_local / 100);

    let pontoDeOrvalhoGeradorCasaAtual = data[GeradorName][0].temperatura_orvalho;
    let pontoDeOrvalhoGeradorPredioAtual = data[GeradorName2][0].temperatura_orvalho;
    
    let CorrenteCasaFaseA = data[GeradorName][0].corrente_Fase_A;
    let CorrenteCasaFaseB = data[GeradorName2][0].corrente_Fase_B;
    let CorrenteCasaFaseNeutro = data[GeradorName][0].corrente_Neutro;
    let CorrentePredioFaseA = data[GeradorName2][0].corrente_Fase_A;
    let CorrentePredioFaseB = data[GeradorName][0].corrente_Fase_B;
    let CorrentePredioFaseNeutro = data[GeradorName2][0].corrente_Neutro;
    let StatusEnergiaCasa = data[GeradorName2][0].status_Energia;
    let StatusEnergiaPredio = data[GeradorName2][0].status_Energia;

    let corTempGeradorCasa = "Verde";
    let corTempGeradorPredio = "Verde";
    let corUmidGeradorCasa = "Verde";
    let corUmidGeradorPredio = "Verde";
    let corstatusEnergiaCasa = "Verde";
    let corstatusEnergiaPredio = "Verde";
    let fornecimentoCasa = "CPFL"
    let fornecimentoPredio = "CPFL"
    

    abrePaginha = function (mensagem, parametro, horas) {
        var myWindow = window.open("", "MsgWindow", "width=900,height=250");
        myWindow.scroll(0, document.body.scrollHeight * 2);
        myWindow.document.writeln(`<body style="background-color:black; padding-bottom:50px; " ><strong style="background-color:red; font-size:25px;">${mensagem} <br> Alerta ${parametro}ºC as ${horas}</strong><hr><br></body><footer></footer>`);
    }

    checkTemperatura = function(Temperatura,setpointmax,setpointmin,horas, local){

        if (Temperatura > setpointmax) {
            abrePaginha(`Temperatura ${local}`, Temperatura, horas)
            return "Vermelho";
    
        } else if (Temperatura < setpointmin) {
            abrePaginha(`Temperatura ${local}`, Temperatura, horas)
            return "Vermelho";
    
        } else {
            return "Verde";
        };

    }
    checkUmidade = function(umidade,setpoint,horas, local){

        if (umidade > setpoint) {
            abrePaginha(`Umidade ${local}`, umidade, horas)
            return "Vermelho";
    
        } else {
            return "Verde";
        };

    }

    checkStatus = function(statusEnergia,horas, local){

        if (statusEnergia >= 1) {
            abrePaginha(`Status Gerador Ligado ${local}`, statusEnergia , horas)
            return "Vermelho";
    
        } else {
            return "Verde";
        };

    }
    checkStatusFornecimento = function(statusEnergia){

        if (statusEnergia >= 1) {
            return "GERADOR";
    
        } else {
            return "CPFL";
        };

    }

    corTempGeradorCasa = checkTemperatura(temperaturaGeradorCasaAtual,setPointTempGeradorMax,setPointTempGeradorMin,HoraGerador1,"Gerador Casa");
    corTempGeradorPredio = checkTemperatura(temperaturaGeradorPredioAtual,setPointTempGeradorMax,setPointTempGeradorMin,HoraGerador2,"Gerador Predio");
    fornecimentoCasa= checkStatusFornecimento(StatusEnergiaCasa);
    fornecimentoPredio=checkStatusFornecimento(StatusEnergiaPredio);
    corstatusEnergiaCasa = checkStatus(StatusEnergiaCasa,HoraGerador1,"Gerador Casa");
    corstatusEnergiaPredio = checkStatus(StatusEnergiaPredio,HoraGerador2,"Gerador Predio");

    stringListGeradorCasa = `<div class="Casa">
                    <h1>Gerador Casa</h1>
                    <ol>
                    <li> Hora: <span class="Verde">${HoraGerador1}</span> </li>
                    <li> Temperatura: <span class="${corTempGeradorCasa}">${temperaturaGeradorCasaAtual.toFixed(3)} ºC</span> </li>
                    <li> Umidade: <span class="Verde">${umidadeGeradorCasaAtual.toFixed(3)} %</span></li>
                    <li> Pressão: <span class="Verde">${pressaoGeradorCasaAtual.toFixed(3)} hpa</span></li>
                    <li> Ponto de Orvalho: <span class="Verde">${pontoDeOrvalhoGeradorCasaAtual.toFixed(3)} ºC</span></li>
                    <li>Fornecimento:<span class="${corstatusEnergiaPredio}"> ${fornecimentoCasa}</span></li>

                    <li>Correntes:</li>
                    <table style="width:100%">
                    <th>Fase A</th>
                    <th>Fase B</th> 
                    <th>Neutro</th>
                    <tr>
                    <td><span class="Verde">${CorrentePredioFaseA.toFixed(2)} A</span></td>
                    <td><span class="Verde">${CorrentePredioFaseB.toFixed(2)} A</span></td>
                    <td><span class="Verde">${CorrentePredioFaseNeutro.toFixed(2)} A</span></td>
                    </tr>
                    </table>
                    </ol>
                    </div>`;
    stringListGeradorPredio = `
                    <div class="Predio">
                    <h1>Gerador Prédio</h1>
                    <ol>
                    <li> Hora: <span class="Verde">${HoraGerador2}</span> </li>
                    <li> Temperatura: <span class="${corTempGeradorPredio}">${temperaturaGeradorPredioAtual.toFixed(3)} ºC</span> </li>
                    <li> Umidade: <span class="Verde">${umidadeGeradorPredioAtual.toFixed(3)} %</span></li>
                    <li> Pressão: <span class="Verde">${pressaoGeradorPredioAtual.toFixed(3)} hpa</span></li>
                    <li> Ponto de Orvalho: <span class="Verde">${pontoDeOrvalhoGeradorPredioAtual.toFixed(3)} ºC</span></li>
                    <li>Fornecimento:<span class="${corstatusEnergiaPredio}"> ${fornecimentoCasa}</span></li>
                    <li>Correntes:</li>
                    <table style="width:100%">
                    <th>Fase A</th>
                    <th>Fase B</th> 
                    <th>Neutro</th>
                    <tr>
                    <td><span class="Verde">${CorrenteCasaFaseA.toFixed(2)} A</span></td>
                    <td><span class="Verde">${CorrenteCasaFaseB.toFixed(2)} A</span></td>
                    <td><span class="Verde">${CorrenteCasaFaseNeutro.toFixed(2)} A</span></td>
                    </tr>
                    </table>
                    </ol>
                    </div>`;



    //const DataCenterCasaList = document.getElementById("DataCenterCasaList");
    //const DataCenterPredioList = document.getElementById("DataCenterPredioList");
    const GeradorCasaList = document.getElementById("GeradorCasaList");
    const GeradorPredioList = document.getElementById("GeradorPredioList");

    //DataCenterCasaList.innerHTML = stringListCasa;
    //DataCenterPredioList.innerHTML = stringListPredio;    
    GeradorCasaList.innerHTML = stringListGeradorCasa;
    GeradorPredioList.innerHTML = stringListGeradorPredio;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = `${h}: ${m}: ${s} `;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}
var GeradoresMonitor = function () {

    var DataTemperaturaGeradorCasa = [];
    var DataTemperaturaGeradorPredio = [];
    var DataUmidadeGeradorCasa = [];
    var DataUmidadeGeradorPredio = [];
    var DataPressureGeradorCasa = [];
    var DataPressureGeradorPredio = [];
    var DataDew_pointGeradorCasa = [];
    var DataDew_pointGeradorPredio = [];
    var DataCorrenteAGeradorCasa = [];
    var DataCorrenteBGeradorCasa = [];
    var DataCorrenteCGeradorCasa = [];
    var DataCorrenteNeutroGeradorCasa = [];
    var DataStatusEnergiaGeradorCasa = [];
    var DataCorrenteAGeradorPredio = [];
    var DataCorrenteBGeradorPredio = [];
    var DataCorrenteCGeradorPredio = [];
    var DataCorrenteNeutroGeradorPredio = [];
    var DataStatusEnergiaGeradorPredio = [];

    var GeradorCasa = new CanvasJS.Chart("GeradorCasa", {
            animationEnabled: false,
            zoomEnabled: true,
            backgroundColor: backgroundColor,
            legend: {
                fontColor: fontColor,
                fontSize: 15,
                fontFamily: "tamoha",
                horizontalAlign: "center", // left, center ,right 
                verticalAlign: "top",  // top, center, bottom
            },
            exportEnabled: true,
            title: {
                fontColor: fontColor,
                text: "Gerador Casa",
                //paddingLeft: 5
            },
            toolTip: toolTipConfig,
    
            axisY: {
                title: "Temperatura (°C)",
                //labelAngle: -45,
                gridColor: GridColor,
                titleFontSize: 15,
                titleFontColor: fontColor,
                labelFontSize: labelFontSize,
                valueFormatString: "0.0",
                labelFontColor: fontColor,
                includeZero: false,
                crosshair: {
                    enabled: true, //disable here
                    snapToDataPoint: true,
                    valueFormatString: "##.0",
                    lineThickness: lineThickness,
    
                },
                stripLines: [
                    {
                        startValue: setPointTempGeradorMax,
                        endValue: setPointTempGeradorMax + 1,
                        color: "rgba(255,0,0,0.00)",
                        label: "ALARME",
                        labelFontColor: "rgba(255,50,50,0.5)",
                        labelAlign: "near",
                        labelBackgroundColor: "rgba(0,0,0,0.01)",
                    },
                    {
                        startValue: setPointTempGeradorMin - 1,
                        endValue: setPointTempGeradorMin,
                        color: "rgba(0,0,255,0.00)",
                        label: "FRIO",
                        labelFontColor: "rgba(0,180,255,0.3)",
                        labelAlign: "near",
                        labelBackgroundColor: "rgba(0,0,0,0.01)",
                    },
                    {
                        startValue: setPointTempGeradorMin,
                        endValue: setPointTempGeradorMax,
                        color: "rgba(0,255,0,0.00)",
                        label: "IDEAL",
                        labelFontColor: "rgba(0,255,100,0.3)",
                        labelAlign: "near",
                        labelBackgroundColor: "rgba(0,0,0,0.01)",
                    },
                    {
                        startValue: setPointTempGeradorMax,
                        endValue: 300,
                        color: "rgba(255,0,0,0.07)",
                    },
                    {
                        startValue: setPointTempGeradorMin,
                        endValue: setPointTempGeradorMax,
                        color: "rgba(0,255,0,0.05)"
                    },
                    {
                        startValue: -40,
                        endValue: setPointTempGeradorMin,
                        color: "rgba(0,0,255,0.07)"
                    },
    
                    {
                        startValue: 2000,
                        endValue: -100,
                        color: bacgroundGraph
                    },
                ]
                //interval: 1,
                //includeZero: true,
            },
            axisY2: {
                title: "Umidade (%)",
                //labelAngle: -45,
                titleFontSize: 15,
                labelFontSize: labelFontSize,
                //reversed: true,
                titleFontColor: fontColor,
                labelFontColor: fontColor,
                valueFormatString: "0.0",
                includeZero: false,
                crosshair: {
                    enabled: true, //disable here
                    snapToDataPoint: true,
                    valueFormatString: "##.0",
                    lineThickness: lineThickness,
                },
                //interval: 2,
                //maximum: 90,
                //includeZero: true,
    
    
            },
            axisX: Xaxis,
            data: [{
                type: lineType,
                lineThickness: lineThickness,
                showInLegend: true,
                markerType: markerType,
                name: "Temperatura (°C)",
                //lineColor: "rgba(255,0,0,1)",
                color: "rgba(255,0,0,1)",
                yValueFormatString: "00.000°C",
                xValueType: "dateTime",
                dataPoints: DataTemperaturaGeradorCasa
            },
            {
                type: lineType,
                showInLegend: true,
                markerType: markerType,
                lineThickness: lineThickness,
                name: "Umidade (%)",
                axisYType: "secondary",
                //lineColor: "rgba(0,0,255,1)",
                color: "rgba(0,170,255,1)",
                yValueFormatString: "#,##%",
                xValueType: "dateTime",
                dataPoints: DataUmidadeGeradorCasa
            }
            ]
        });
        var GeradorPredio = new CanvasJS.Chart("GeradorPredio", {
            animationEnabled: false,
            zoomEnabled: true,
            backgroundColor: backgroundColor,
            legend: {
                fontColor: fontColor,
                fontSize: 15,
                fontFamily: "tamoha",
                horizontalAlign: "center", // left, center ,right 
                verticalAlign: "top",  // top, center, bottom
            },
            exportEnabled: true,
            title: {
                fontColor: fontColor,
                text: "Gerador Prédio",
                //paddingLeft: 5
            },
            toolTip: toolTipConfig,
    
            axisY: {
                title: "Temperatura (°C)",
                //labelAngle: -45,
                gridColor: GridColor,
                titleFontSize: 15,
                titleFontColor: fontColor,
                labelFontSize: labelFontSize,
                valueFormatString: "0.0",
                labelFontColor: fontColor,
                includeZero: false,
                crosshair: {
                    enabled: true, //disable here
                    snapToDataPoint: true,
                    valueFormatString: "##.0",
                    lineThickness: lineThickness,
    
                },
                stripLines: [
                    {
                        startValue: setPointTempGeradorMax,
                        endValue: setPointTempGeradorMax + 1,
                        color: "rgba(255,0,0,0.00)",
                        label: "ALARME",
                        labelFontColor: "rgba(255,50,50,0.5)",
                        labelAlign: "near",
                        labelBackgroundColor: "rgba(0,0,0,0.01)",
                    },
                    {
                        startValue: setPointTempGeradorMin - 1,
                        endValue: setPointTempGeradorMin,
                        color: "rgba(0,0,255,0.00)",
                        label: "FRIO",
                        labelFontColor: "rgba(0,180,255,0.3)",
                        labelAlign: "near",
                        labelBackgroundColor: "rgba(0,0,0,0.01)",
                    },
                    {
                        startValue: setPointTempGeradorMin,
                        endValue: setPointTempGeradorMax,
                        color: "rgba(0,255,0,0.00)",
                        label: "IDEAL",
                        labelFontColor: "rgba(0,255,100,0.3)",
                        labelAlign: "near",
                        labelBackgroundColor: "rgba(0,0,0,0.01)",
                    },
                    {
                        startValue: setPointTempGeradorMax,
                        endValue: 300,
                        color: "rgba(255,0,0,0.07)",
                    },
                    {
                        startValue: setPointTempGeradorMin,
                        endValue: setPointTempGeradorMax,
                        color: "rgba(0,255,0,0.05)"
                    },
                    {
                        startValue: -40,
                        endValue: setPointTempGeradorMin,
                        color: "rgba(0,0,255,0.07)"
                    },
    
                    {
                        startValue: 2000,
                        endValue: -100,
                        color: bacgroundGraph
                    },
                ]
                //interval: 1,
                //includeZero: true,
            },
            axisY2: {
                title: "Umidade (%)",
                //labelAngle: -45,
                titleFontSize: 15,
                labelFontSize: labelFontSize,
                //reversed: true,
                titleFontColor: fontColor,
                labelFontColor: fontColor,
                valueFormatString: "0.0",
                includeZero: false,
                crosshair: {
                    enabled: true, //disable here
                    snapToDataPoint: true,
                    valueFormatString: "##.0",
                    lineThickness: lineThickness,
                },
                //interval: 2,
                //maximum: 90,
                //includeZero: true,
    
    
            },
            axisX: Xaxis,
            data: [{
                type: lineType,
                lineThickness: lineThickness,
                showInLegend: true,
                markerType: markerType,
                name: "Temperatura (°C)",
                //lineColor: "rgba(255,0,0,1)",
                color: "rgba(255,0,0,1)",
                yValueFormatString: "00.000°C",
                xValueType: "dateTime",
                dataPoints: DataTemperaturaGeradorPredio
            },
            {
                type: lineType,
                showInLegend: true,
                markerType: markerType,
                lineThickness: lineThickness,
                name: "Umidade (%)",
                axisYType: "secondary",
                //lineColor: "rgba(0,0,255,1)",
                color: "rgba(0,170,255,1)",
                yValueFormatString: "#,##%",
                xValueType: "dateTime",
                dataPoints: DataUmidadeGeradorPredio
            }
            ]
        });


    var CorrentesCasa = new CanvasJS.Chart("CorrentesCasa", {
        animationEnabled: false,
        zoomEnabled: true,
        backgroundColor: backgroundColor,
        title: {
            fontColor: fontColor,

            text: "Gerador Casa",
        },
        toolTip: toolTipConfig,
        exportEnabled: true,
        legend: {
            fontColor: fontColor,
            fontSize: 15,
            fontFamily: "tamoha",
            horizontalAlign: "center", // left, center ,right 
            verticalAlign: "top",  // top, center, bottom
        },
        axisY: {
            gridColor: GridColor,
            titleFontSize: 15,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: true,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true
        },
        axisY2: {
            titleFontSize: 15,
            gridColor: GridColor,
            //reversed: true,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: true,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            stripLines: [
                {
                    startValue: 2000,
                    endValue: -100,
                    color: bacgroundGraph
                },]
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true

        },
        axisY3: {
            titleFontSize: 15,
            gridColor: GridColor,
            //reversed: true,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: true,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            stripLines: [
                {
                    startValue: 2000,
                    endValue: -100,
                    color: bacgroundGraph
                },]
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true

        },axisY3: {
            titleFontSize: 15,
            gridColor: GridColor,
            //reversed: true,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: true,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            stripLines: [
                {
                    startValue: 2000,
                    endValue: -100,
                    color: bacgroundGraph
                },]
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true

        },
        axisX: Xaxis,
        data: [{
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Corrente Fase A (A)",
            //lineColor: "rgba(255,150,50,0.3)",
            color: "rgb(255,255,0)",
            yValueFormatString: "0.00 A",
            xValueType: "dateTime",
            dataPoints: DataCorrenteAGeradorCasa
        }, {
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Corrente Fase B (A)",
            //lineColor: "rgba(50,150,150,0.3)",
            color: "rgb(255,255,0)",
            yValueFormatString: "0.00 A",
            xValueType: "dateTime",
            dataPoints: DataCorrenteBGeradorCasa
        },{
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Corrente Neutro (A)",
            //lineColor: "rgba(50,150,150,0.3)",
            color: "rgb(255,255,0)",
            yValueFormatString: "0.00 A",
            xValueType: "dateTime",
            dataPoints: DataCorrenteNeutroGeradorCasa
        },{
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Status Gerador",
            //lineColor: "rgba(50,150,150,0.3)",
            color: "rgb(0,255,0)",
            axisYType: "secondary",
            yValueFormatString: "0",
            xValueType: "dateTime",
            dataPoints: DataStatusEnergiaGeradorCasa
        }]
    });
    var CorrentesPredio = new CanvasJS.Chart("CorrentesPredio", {
        animationEnabled: false,
        zoomEnabled: true,
        backgroundColor: backgroundColor,
        title: {
            fontColor: fontColor,

            text: "Gerador Prédio",
        },
        toolTip: toolTipConfig,
        exportEnabled: true,
        legend: {
            fontColor: fontColor,
            fontSize: 15,
            fontFamily: "tamoha",
            horizontalAlign: "center", // left, center ,right 
            verticalAlign: "top",  // top, center, bottom
        },
        axisY: {
            gridColor: GridColor,
            titleFontSize: 15,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: false,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true
        },
        axisY2: {
            titleFontSize: 15,
            gridColor: GridColor,
            //reversed: true,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: false,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            stripLines: [
                {
                    startValue: 2000,
                    endValue: -100,
                    color: bacgroundGraph
                },]
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true

        },
        axisY3: {
            titleFontSize: 15,
            gridColor: GridColor,
            //reversed: true,
            titleFontColor: fontColor,
            labelFontColor: fontColor,
            includeZero: false,
            labelFontSize: labelFontSize,
            valueFormatString: "0.0",
            crosshair: {
                enabled: true, //disable here
                snapToDataPoint: true,
                valueFormatString: "##.0"
            },
            stripLines: [
                {
                    startValue: 2000,
                    endValue: -100,
                    color: bacgroundGraph
                },]
            //labelAngle: -45,
            //interval: 0.5,
            //includeZero: true

        
        },
        axisX: Xaxis,
        data: [{
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Corrente Fase A (A)",
            //lineColor: "rgba(255,150,50,0.3)",
            color: "rgb(255,255,0)",
            yValueFormatString: "0.00 A",
            xValueType: "dateTime",
            dataPoints: DataCorrenteAGeradorPredio
        }, {
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Corrente Fase B (A)",
            //lineColor: "rgba(50,150,150,0.3)",
            color: "rgb(255,255,0)",
            axisYType: "secondary",
            yValueFormatString: "0.00 A",
            xValueType: "dateTime",
            dataPoints: DataCorrenteBGeradorPredio
        },{
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Corrente Neutro (A)",
            //lineColor: "rgba(50,150,150,0.3)",
            color: "rgb(255,255,0)",
            axisYType: "secondary",
            yValueFormatString: "0.00 A",
            xValueType: "dateTime",
            dataPoints: DataCorrenteNeutroGeradorPredio
        },{
            type: lineType,
            showInLegend: true,
            markerType: markerType,
            lineThickness: lineThickness,
            name: "Status Gerador",
            //lineColor: "rgba(50,150,150,0.3)",
            color: "rgb(0,255,0)",
            axisYType: "secondary",
            yValueFormatString: "0",
            xValueType: "dateTime",
            dataPoints: DataStatusEnergiaGeradorPredio
        }]
    });
    
    
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    var update = function (json) {
        DataTemperaturaGeradorCasa.length = 0;
        DataUmidadeGeradorCasa.length = 0;
        DataPressureGeradorCasa.length = 0;
        DataDew_pointGeradorCasa.length = 0;
        DataTemperaturaGeradorPredio.length = 0;
        DataUmidadeGeradorPredio.length = 0;
        DataPressureGeradorPredio.length = 0;
        DataDew_pointGeradorPredio.length = 0;
        DataCorrenteAGeradorCasa.length = 0;
        DataCorrenteBGeradorCasa.length = 0;
        DataCorrenteCGeradorCasa.length = 0;
        DataCorrenteNeutroGeradorCasa.length = 0;
        DataStatusEnergiaGeradorCasa.length = 0;
        DataCorrenteAGeradorPredio.length = 0;
        DataCorrenteBGeradorPredio.length = 0;
        DataCorrenteCGeradorPredio.length = 0;
        DataCorrenteNeutroGeradorPredio.length = 0;
        DataStatusEnergiaGeradorPredio.length = 0;

        let data = json.geradores_status;
        ultima_amostra(data);
        for (var i = 0; i < data[GeradorName].length; i++) {
            let localtimestamp = (data[GeradorName][i].timestamp - (3600 * 3)) * 1000
            let datatimeUTC = ((localtimestamp) + ((10800) * 1000))
            let HMS = new Date(localtimestamp).toISOString().slice(0, 19).replace('T', ' ');
            DataTemperaturaGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].temperatura_ar, label: HMS
            });
            DataUmidadeGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].umidade, label: HMS

            });
            DataDew_pointGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].temperatura_orvalho, label: HMS

            });
            DataPressureGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].pressao_local / 100, label: HMS

            });
            DataCorrenteAGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].corrente_Fase_A , label: HMS

            });
            DataCorrenteBGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].corrente_Fase_B , label: HMS

            });
            DataCorrenteCGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].corrente_Fase_C , label: HMS

            });
            DataCorrenteNeutroGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].corrente_Neutro , label: HMS

            });
            DataStatusEnergiaGeradorCasa.push({
                x: datatimeUTC,
                y: data[GeradorName][i].status_Energia , label: HMS

            });

        }
        for (var i = 0; i < data[GeradorName2].length; i++) {
            let localtimestamp = (data[GeradorName2][i].timestamp - (3600 * 3)) * 1000
            let datatimeUTC = ((localtimestamp) + ((10800) * 1000))
            let HMS = new Date(localtimestamp).toISOString().slice(0, 19).replace('T', ' ');
            DataTemperaturaGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].temperatura_ar, label: HMS
            });
            DataUmidadeGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].umidade, label: HMS

            });

            DataDew_pointGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].temperatura_orvalho, label: HMS

            });

            DataPressureGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].pressao_local / 100, label: HMS

            });
            DataCorrenteAGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].corrente_Fase_A , label: HMS

            });
            DataCorrenteBGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].corrente_Fase_B , label: HMS

            });
            DataCorrenteCGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].corrente_Fase_C , label: HMS

            });
            DataCorrenteNeutroGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].corrente_Neutro , label: HMS

            });
            DataStatusEnergiaGeradorPredio.push({
                x: datatimeUTC,
                y: data[GeradorName2][i].status_Energia , label: HMS

            });


        }
        document.body.style.cursor = "default"
        GeradorCasa.render();
        GeradorPredio.render();
        CorrentesCasa.render();
        CorrentesPredio.render();

    }
    //************auto-update*****************/
    callUpdate = function () {
        $.getJSON(`/geradores/select/${botao}/${tempo}`, update);

    }
    callUpdate()

    setInterval(function () {
        callUpdate()
    }, 5000)

    botaoSelect = function () {

        if (botao === 'horas') {
            seletor = 'Full data';
            document.querySelectorAll('.DiaSelect').forEach(e => e.style.visibility = "hidden");
            document.querySelectorAll('.HorasMedia').forEach(e => e.style.visibility = "hidden");
            document.querySelectorAll('.intraHour').forEach(e => e.style.visibility = "hidden");
            document.querySelectorAll('.intraDay').forEach(e => e.style.visibility = "visible");

        }
        else if (botao === 'horasmedia') {
            seletor = 'Media/Hora';
            document.querySelectorAll('.DiaSelect').forEach(e => e.style.visibility = "visible");
            document.querySelectorAll('.HorasMedia').forEach(e => e.style.visibility = "visible");
            document.querySelectorAll('.intraDay').forEach(e => e.style.visibility = "visible");
            document.querySelectorAll('.intraHour').forEach(e => e.style.visibility = "hidden");

        } else {
            seletor = 'Media/Dia';
            document.querySelectorAll('.DiaSelect').forEach(e => e.style.visibility = "visible");
            document.querySelectorAll('.HorasMedia').forEach(e => e.style.visibility = "visible");
            document.querySelectorAll('.intraDay').forEach(e => e.style.visibility = "hidden");
            document.querySelectorAll('.intraHour').forEach(e => e.style.visibility = "hidden");

        }


        if (botao === "dias") {

            tempo = tempoDia;
        }
        else if (botao === 'horas' || botao === 'horasmedia') {
            tempo = tempoHora;
        }


        callUpdate();
    }

    tamanhoGrafico = function (horas) {
        tempoHora = parseFloat(horas);
        tempoDia = tempoHora / 24;
        console.log(tempoDia, tempoHora)

        document.body.style.cursor = "wait"
        botaoSelect();
    }

    periodoSelect = function (periodo) {
        botao = periodo;
        document.body.style.cursor = "wait"
        botaoSelect();

    }

    botaoSelect()

}