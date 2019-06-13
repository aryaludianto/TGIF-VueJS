

let stateAbb = [
  {
    "name": "All",
    "abbreviation": "all"
  },
  {
      "name": "Alabama",
      "abbreviation": "AL"
  },
  {
      "name": "Alaska",
      "abbreviation": "AK"
  },
  {
      "name": "American Samoa",
      "abbreviation": "AS"
  },
  {
      "name": "Arizona",
      "abbreviation": "AZ"
  },
  {
      "name": "Arkansas",
      "abbreviation": "AR"
  },
  {
      "name": "California",
      "abbreviation": "CA"
  },
  {
      "name": "Colorado",
      "abbreviation": "CO"
  },
  {
      "name": "Connecticut",
      "abbreviation": "CT"
  },
  {
      "name": "Delaware",
      "abbreviation": "DE"
  },
  {
      "name": "District Of Columbia",
      "abbreviation": "DC"
  },
  {
      "name": "Federated States Of Micronesia",
      "abbreviation": "FM"
  },
  {
      "name": "Florida",
      "abbreviation": "FL"
  },
  {
      "name": "Georgia",
      "abbreviation": "GA"
  },
  {
      "name": "Guam",
      "abbreviation": "GU"
  },
  {
      "name": "Hawaii",
      "abbreviation": "HI"
  },
  {
      "name": "Idaho",
      "abbreviation": "ID"
  },
  {
      "name": "Illinois",
      "abbreviation": "IL"
  },
  {
      "name": "Indiana",
      "abbreviation": "IN"
  },
  {
      "name": "Iowa",
      "abbreviation": "IA"
  },
  {
      "name": "Kansas",
      "abbreviation": "KS"
  },
  {
      "name": "Kentucky",
      "abbreviation": "KY"
  },
  {
      "name": "Louisiana",
      "abbreviation": "LA"
  },
  {
      "name": "Maine",
      "abbreviation": "ME"
  },
  {
      "name": "Marshall Islands",
      "abbreviation": "MH"
  },
  {
      "name": "Maryland",
      "abbreviation": "MD"
  },
  {
      "name": "Massachusetts",
      "abbreviation": "MA"
  },
  {
      "name": "Michigan",
      "abbreviation": "MI"
  },
  {
      "name": "Minnesota",
      "abbreviation": "MN"
  },
  {
      "name": "Mississippi",
      "abbreviation": "MS"
  },
  {
      "name": "Missouri",
      "abbreviation": "MO"
  },
  {
      "name": "Montana",
      "abbreviation": "MT"
  },
  {
      "name": "Nebraska",
      "abbreviation": "NE"
  },
  {
      "name": "Nevada",
      "abbreviation": "NV"
  },
  {
      "name": "New Hampshire",
      "abbreviation": "NH"
  },
  {
      "name": "New Jersey",
      "abbreviation": "NJ"
  },
  {
      "name": "New Mexico",
      "abbreviation": "NM"
  },
  {
      "name": "New York",
      "abbreviation": "NY"
  },
  {
      "name": "North Carolina",
      "abbreviation": "NC"
  },
  {
      "name": "North Dakota",
      "abbreviation": "ND"
  },
  {
      "name": "Northern Mariana Islands",
      "abbreviation": "MP"
  },
  {
      "name": "Ohio",
      "abbreviation": "OH"
  },
  {
      "name": "Oklahoma",
      "abbreviation": "OK"
  },
  {
      "name": "Oregon",
      "abbreviation": "OR"
  },
  {
      "name": "Palau",
      "abbreviation": "PW"
  },
  {
      "name": "Pennsylvania",
      "abbreviation": "PA"
  },
  {
      "name": "Puerto Rico",
      "abbreviation": "PR"
  },
  {
      "name": "Rhode Island",
      "abbreviation": "RI"
  },
  {
      "name": "South Carolina",
      "abbreviation": "SC"
  },
  {
      "name": "South Dakota",
      "abbreviation": "SD"
  },
  {
      "name": "Tennessee",
      "abbreviation": "TN"
  },
  {
      "name": "Texas",
      "abbreviation": "TX"
  },
  {
      "name": "Utah",
      "abbreviation": "UT"
  },
  {
      "name": "Vermont",
      "abbreviation": "VT"
  },
  {
      "name": "Virgin Islands",
      "abbreviation": "VI"
  },
  {
      "name": "Virginia",
      "abbreviation": "VA"
  },
  {
      "name": "Washington",
      "abbreviation": "WA"
  },
  {
      "name": "West Virginia",
      "abbreviation": "WV"
  },
  {
      "name": "Wisconsin",
      "abbreviation": "WI"
  },
  {
      "name": "Wyoming",
      "abbreviation": "WY"
  }
]



//URL for API will pass as arguments to fetch function
const senate = "https://api.propublica.org/congress/v1/113/senate/members.json";
const house = "https://api.propublica.org/congress/v1/113/house/members.json";


// -------------------------VUE-INSTANCE------------------------------
var app = new Vue({  
  el: '#app',  
  data: {    
    members:{},
    statistics:{
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
    } ,stateAbb ,selectedState:"all", selectedParty:[]
  },
  methods:{
    statFill: function (member) {
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
          let result = !party[part][0] ? 0 : (party[part].map(dem => dem["votes_with_party_pct"]).reduce((prev, next) => prev + next)/party[part].length)
          return Math.round(result*100)/100  ;
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
            this.statistics["members_often_not_vote_with_party"] = this.nameVal(vote("least","party",member));
            this.statistics["members_often_vote_with_party"] = this.nameVal(vote("most","party",member));
            this.statistics["members_missed_most_vote"] = this.nameVal(vote("most","member",member));
            this.statistics["members_missed_least_vote"] = this.nameVal(vote("least","member",member));
            this.statistics["number_of_total"] = Math.round((this.statistics["number_of_democrats"] + this.statistics["number_of_republicans"] + this.statistics["number_of_independents"]) * 100 )/100;

            if(!this.statistics["independents_vote_with_party"]) this.statistics["total_vote_with_party"] = Math.round(((this.statistics["democrats_vote_with_party"] + this.statistics["republicans_vote_with_party"] + this.statistics["independents_vote_with_party"])/2)*100)/100;
            else this.statistics["total_vote_with_party"] = Math.round(((this.statistics["democrats_vote_with_party"] + this.statistics["republicans_vote_with_party"] + this.statistics["independents_vote_with_party"])/3)*100)/100;
          },
           nameVal: function (members) {
            //name validation---------------------------------
            let memTemp = []
            
            members.forEach(data=> {
            let first_name = data.first_name || '',
                middle_name = data.middle_name || '', 
                last_name= data.last_name || '', 
                person_full_name = !middle_name && (last_name + " " + first_name) || (last_name + " "+ first_name +" " + middle_name),
                seniorText = data.seniority == 1 && (data.seniority + " year") || (data.seniority + " years"),
                percentVoteText = data.votes_with_party_pct + "%";
                stateAbb.filter(state=> { if(state.abbreviation === data.state) data.state_name = state.name}); 
          
              data.full_name = person_full_name;
              data.seniority_txt = seniorText;
              data.votes_with_party_pct_txt = percentVoteText; 
          
              memTemp.push(data); 
            })
            return memTemp;
          },
           loader: function () {
            let loader = document.getElementById("loader"),
                container = document.getElementById("container");
                loader.setAttribute("class", "active");
                container.setAttribute("class", "active")
          },
           fetchData: function (dataURL) {
            
            fetch(dataURL, { method:'GET',
                               headers: { 'X-API-Key' : 'yDopPricaMTxYJvgYSF3d1dah1k2TlgaijneYq1G' }})
              .then(response => {
                if(response.ok){ 
                  return response.json()
                } else throw new Error(response.statusText)
              }).then(data => {
                  this.members = data.results[0].members
                  this.filteredMembers = this.nameVal(this.members)
                  this.statFill(this.members);
                  //this.filterData;
                  this.loader();
          
              }).catch(error =>  {
                console.log('ERROR: ' + error.message)
              });   
            }
  },
  computed: {
    filterData : function () {
      let data, tempData=[];
    
      data = this.selectedState === "all" ? this.members : this.members.filter(data=> data.state === this.selectedState);
      this.selectedParty.length === 0 ? tempData = data : this.selectedParty.map(party=> data.filter(member=> {if(member.party === party) tempData.push(member)}))

      tempData.length === 0 ? tempData = [{no_name:"All data are filtered"}] :  tempData;

     return tempData;
    }
    
  }
}); 

//------------------------------------END-OF-VUE-------------------------------



