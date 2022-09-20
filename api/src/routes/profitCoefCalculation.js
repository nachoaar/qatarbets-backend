
var identifyBet = function (id1, id2) {

    var bestTeams = [1, 2, 6, 9, 10, 25, 1118, 26];
    var regularTeams = [14, 15, 16, 3, 21, 24, 27, 2382, 2384, 7];
    var worstTeams = [12, 13, 17, 20, 23, 22, 28, 29, 31, 767, 1504, 1530, 1569, 5529];

    var profitCoefHome
    var profitCoefDraw
    var profitCoefAway

    id1 = Number(id1)
    id2 = Number(id2)

    //home bestTeams

    if (bestTeams.includes(id1) && bestTeams.includes(id2)) {
        profitCoefHome = 1.6
        profitCoefDraw = 1.3
        profitCoefAway = 1.6
    }
    if (bestTeams.includes(id1) && regularTeams.includes(id2)) {
        profitCoefHome = 1.3
        profitCoefDraw = 1.5
        profitCoefAway = 1.9
    }
    if (bestTeams.includes(id1) && worstTeams.includes(id2)) {
        profitCoefHome = 1.45
        profitCoefDraw = 1.85
        profitCoefAway = 3
    }

    //home RegularTeams 

    if (regularTeams.includes(id1) && bestTeams.includes(id2)) {
        profitCoefHome = 1.9
        profitCoefDraw = 1.65
        profitCoefAway = 1.3
    }
    if (regularTeams.includes(id1) && regularTeams.includes(id2)) {
        profitCoefHome = 1.85
        profitCoefDraw = 1.4
        profitCoefAway = 1.85
    }
    if (regularTeams.includes(id1) && worstTeams.includes(id2)) {
        profitCoefHome = 1.3
        profitCoefDraw = 1.75
        profitCoefAway = 2.5
    }

    //home worstTeams 

    if (worstTeams.includes(id1) && bestTeams.includes(id2)) {
        profitCoefHome = 2.65
        profitCoefDraw = 1.75
        profitCoefAway = 1.35
    }
    if (worstTeams.includes(id1) && regularTeams.includes(id2)) {
        profitCoefHome = 2
        profitCoefDraw = 1.55
        profitCoefAway = 1.4
    }
    if (worstTeams.includes(id1) && worstTeams.includes(id2)) {
        profitCoefHome = 1.95
        profitCoefDraw = 1.35
        profitCoefAway = 1.95
    }

    let betCoefobj = {
        profitCoefHome: profitCoefHome,
        profitCoefDraw: profitCoefDraw,
        profitCoefAway: profitCoefAway
    }

    return betCoefobj
}


module.exports = {
    identifyBet
};
