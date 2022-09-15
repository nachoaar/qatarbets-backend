
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
        profitCoefHome = 1.4
        profitCoefDraw = 1.2
        profitCoefAway = 1.4
    }
    if (bestTeams.includes(id1) && regularTeams.includes(id2)) {
        profitCoefHome = 1.2
        profitCoefDraw = 1.3
        profitCoefAway = 1.5
    }
    if (bestTeams.includes(id1) && worstTeams.includes(id2)) {
        profitCoefHome = 1.15
        profitCoefDraw = 1.35
        profitCoefAway = 1.6
    }

    //home RegularTeams 

    if (regularTeams.includes(id1) && bestTeams.includes(id2)) {
        profitCoefHome = 1.5
        profitCoefDraw = 1.3
        profitCoefAway = 1.2
    }
    if (regularTeams.includes(id1) && regularTeams.includes(id2)) {
        profitCoefHome = 1.4
        profitCoefDraw = 1.2
        profitCoefAway = 1.4
    }
    if (regularTeams.includes(id1) && worstTeams.includes(id2)) {
        profitCoefHome = 1.2
        profitCoefDraw = 1.3
        profitCoefAway = 1.5
    }

    //home worstTeams 

    if (worstTeams.includes(id1) && bestTeams.includes(id2)) {
        profitCoefHome = 1.6
        profitCoefDraw = 1.35
        profitCoefAway = 1.15
    }
    if (worstTeams.includes(id1) && regularTeams.includes(id2)) {
        profitCoefHome = 1.5
        profitCoefDraw = 1.3
        profitCoefAway = 1.2
    }
    if (worstTeams.includes(id1) && worstTeams.includes(id2)) {
        profitCoefHome = 1.4
        profitCoefDraw = 1.2
        profitCoefAway = 1.4
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
