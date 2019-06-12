

var statistics = {
  "number_of_democrats": 0,
  "number_of_republicans":0,
  "number_of_independents":0,
  "number_of_total":0,
  "total_vote_with_party":0,
  "democrats_vote_with_party":0,
  "republicans_vote_with_party":0,
  "independents_vote_with_party":0,
  "members_often_not_vote_with_party":0,
  "members_often_vote_with_party":0,
  "members_missed_most_vote":0,
  "members_missed_least_vote":0
};



function statFill (member) {
  let party = { 
    democrats: [],
    republicans: [],
    independents: [] 
  };

  function partFill (data) {
    data.filter(data=> {
      if (data.party === "D") party.democrats.push(data)
      else if (data.party === "R") party.republicans.push(data)
      else party.independents.push(data)
    })
}


function votesWithParty (part){
  let result = !party[part][0] ? 0 : (party[part].map(dem => dem["votes_with_party_pct"]).reduce((prev, next) => prev + next)/statistics[`number_of_${part}`])
  return Math.round(result*100)/100 ;
}

// function vote --> type = "most"/"least", vote = "party"/"member"
function vote (type, vote, data){
let time = data.length * 0.1,
  tempData=[...data],
    result = [], i=0, 
    voteType = vote === "party" ? "votes_with_party_pct" : "missed_votes_pct"; 
  
  tempData.sort ((a,b)=> type === "least" ? a[voteType] - b[voteType] : b[voteType] - a[voteType])
 
  while(i <= time ){
  result.push(tempData[i])
    while (i>=time && tempData[i][voteType] === tempData[i+1][voteType]) {
      i++;
      result.push(tempData[i]);
      if (tempData[i][voteType]  != tempData[i+1][voteType] ) break;
    }
  i++;
}
  return result;
}

    partFill(member);
    this.statistics["number_of_democrats"] = party.democrats.length;
    this.statistics["number_of_republicans"] = party.republicans.length;
    this.statistics["number_of_independents"] = party.independents.length;
    this.statistics["democrats_vote_with_party"] = votesWithParty("democrats");
    this.statistics["republicans_vote_with_party"] = votesWithParty("republicans");
    this.statistics["independents_vote_with_party"] = votesWithParty("independents");
    this.statistics["members_often_not_vote_with_party"] = vote("least","party",member);
    this.statistics["members_often_vote_with_party"] = vote("most","party",member);
    this.statistics["members_missed_most_vote"] = vote ("most","member",member);
    this.statistics["members_missed_least_vote"] = vote ("least","member",member);
  }





//------------------display the data---------------------

function glanceTab (member) {
  var tbody = document.getElementById("atGlance");
  tbody.innerHTML = ""
  
      member["number_of_total"] = Math.round((member["number_of_democrats"] + member["number_of_republicans"] + member["number_of_independents"]) * 100 )/100;
      
      if(!member["independents_vote_with_party"]) member["total_vote_with_party"] = Math.round(((member["democrats_vote_with_party"] + member["republicans_vote_with_party"] + member["independents_vote_with_party"])/2)*100)/100;
      else member["total_vote_with_party"] = Math.round(((member["democrats_vote_with_party"] + member["republicans_vote_with_party"] + member["independents_vote_with_party"])/3)*100)/100;
      
      let senTab = document.getElementById("atGlance");
      let textParty = ["Republicans","Democrats", "Independents", "Total"]
    
    textParty.forEach(text => {
      let row = document.createElement("tr");
      let textNice = [text, member[`number_of_${text.toLowerCase()}`], member[`${text.toLowerCase()}_vote_with_party`]+ " %"]
        
      textNice.forEach(textFill => {
          
          let col = document.createElement("td");
          let text = document.createTextNode(textFill)
          col.appendChild(text)
          return row.appendChild(col)

        })

        return senTab.appendChild(row)

    })
}

//---- tab = "leastLoyal" || "mostLoyal" ||  "leastEngagedTab" || "mostEngageTab", member = statistics
function dispTab (tab , member) {
  var tbody = document.getElementById(tab);
  tbody.innerHTML = "";

  let persons;
 
  if (tab === "leastLoyal" || tab === "mostLoyal"){
    persons = tab === "leastLoyal" ? member.members_often_not_vote_with_party : member.members_often_vote_with_party;  
  } else if ( tab === "leastEngagedTab" || tab === "mostEngagedTab"){
     persons = tab === "leastEngagedTab" ? member.members_missed_most_vote : member.members_missed_least_vote;
  }

  persons.forEach(person=> {
    let row = document.createElement("tr"), partyVotes, partyVotesPercs;
  
      if (tab === "leastLoyal" || tab === "mostLoyal"){
        partyVotes = document.createTextNode(person.total_votes), 
        partyVotesPercs = document.createTextNode(person.votes_with_party_pct + " %")
      } else if ( tab === "leastEngagedTab" || tab === "mostEngagedTab"){
        partyVotes = document.createTextNode(person.missed_votes), 
        partyVotesPercs = document.createTextNode(person.missed_votes_pct + " %")
      }

    let text = [fullName = nameVal(person), partyVotes, partyVotesPercs]

        text.forEach(text=> {
          let col =document.createElement("td");
          col.appendChild(text);

          return row.appendChild(col)

        })

        return tbody.appendChild(row);
  })

}

//----display data statistics---------
function dispDataLoyalty () {
  glanceTab(statistics);
  dispTab ("mostLoyal", statistics)
  dispTab ("leastLoyal", statistics)
}

function dispDataAttendance () {
  glanceTab(statistics);  
  dispTab("leastEngagedTab", statistics);
  dispTab("mostEngagedTab", statistics);
}
