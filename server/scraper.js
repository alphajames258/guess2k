const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const playerImage = require('./image.json');
const playerData = require('./data.json');
const stringSimilarity = require('string-similarity');

const allNBATeams = [
  'atlanta hawks',
  'boston celtics',
  'brooklyn nets',
  'charlotte hornets',
  'chicago bulls',
  'cleveland cavaliers',
  'dallas mavericks',
  'denver nuggets',
  'detroit pistons',
  'golden state warriors',
  'houston rockets',
  'indiana pacers',
  'los angeles clippers',
  'los angeles lakers',
  'memphis grizzlies',
  'miami heat',
  'milwaukee bucks',
  'minnesota timberwolves',
  'new orleans pelicans',
  'new york knicks',
  'oklahoma city thunder',
  'orlando magic',
  'philadelphia 76ers',
  'phoenix suns',
  'portland trail blazers',
  'sacramento kings',
  'san antonio spurs',
  'toronto raptors',
  'utah jazz',
  'washington wizards',
];

const scraper = async () => {
  const browser = await puppeteer.launch({ headless: false }); // launching
  const scraperData = {};
  try {
    for (let i = 0; i < allNBATeams.length; i += 1) {
      console.log(`currently scraping ${allNBATeams[i]}`);
      const data = await getTeamData(allNBATeams[i], browser);
      scraperData[allNBATeams[i]] = data || [];
    }

    fs.writeFile(
      path.join(__dirname, 'data.json'),
      JSON.stringify(scraperData),
      (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      }
    );
  } catch (e) {
    console.log(`error at scraper: ${allNBATeams[i]}`, e);
  } finally {
    await browser.close(); // close the browser after scraping
  }
};

async function getTeamData(teamName, browser) {
  try {
    const page = await browser.newPage();
    const formattedTeamname = teamName.replace(/ /gi, '-');
    console.log(formattedTeamname, 'name');
    const link = `https://www.2kratings.com/teams/${formattedTeamname}`;

    console.log('the link is', link);
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36';
    await page.setUserAgent(ua);

    await page.goto(link, { waitUntil: 'domcontentloaded' });

    const test = await page.evaluate(() => {
      const tableRows = Array.from(
        document.querySelector('.content').children[1].querySelector('tbody')
          .children
      );

      const players = [];
      const roles = ['PG', 'SG', 'SF', 'PF', 'C'];
      tableRows.forEach((row) => {
        if (row.children.length >= 5) {
          const playerData = {};
          playerData.name =
            row.children[1].querySelector('.entry-font').textContent;
          // playerData.test = row.children[1];
          let entries = row.children[1];

          let details = entries.querySelector(
            '.entry-subtext-font.crop-subtext-font'
          );
          if (details.children.length === 7) {
            playerData.position = [
              details.children[2].textContent,
              details.children[4].textContent,
            ];
            playerData.height = details.children[5].textContent;
          } else if (details.children.length === 6) {
            if (details.children[3].textContent === '/') {
              playerData.position = [
                details.children[2].textContent,
                details.children[4].textContent,
              ];
              playerData.height = details.textContent;
            } else if (details.children[2].textContent === '/') {
              playerData.position = [
                details.children[1].textContent,
                details.children[3].textContent,
              ];
              playerData.height = details.children[4].textContent;
            }
          } else if (details.children.length === 5) {
            console.log(details, 'anthony details');
            if (details.children[2].textContent === '/') {
              playerData.position = [
                details.children[1].textContent,
                details.children[3].textContent,
              ];
              if (/\d/.test(details.children[4].textContent)) {
                playerData.height = details.children[4].textContent;
              } else {
                playerData.height = details.textContent;
              }
            } else {
              playerData.position = [
                details.children[2].textContent,
                details.children[4].textContent,
              ];
              playerData.height = details.textContent;
            }
          } else if (details.children.length === 4) {
            if (!details.children[1].textContent) {
              playerData.position = details.children[2].textContent;
              playerData.height = details.textContent;
            } else {
              playerData.position = [details.children[1].textContent];
              playerData.height = details.children[2].textContent;
            }
          } else if (details.children.length === 3) {
            playerData.position = [details.children[1].textContent];
            playerData.height = details.textContent;
          } else if (details.children.length === 2) {
            playerData.position = [details.children[1].textContent];
            playerData.extraData = details.textContent;
          } else {
            playerData.position = [details.children[0].textContent];
            playerData.height = details.children[1].textContent;
          }

          playerData.overall =
            row.children[2].querySelector('span').textContent;

          players.push(playerData);
        }
      });

      return players;
    });

    return test;
  } catch (e) {
    console.log('error at scraping team data', e);
  }
}

// const colors = {
//   'PHO' : 'orange',
//   'NO' : 'navy',
//   'CHI' : 'red',
//   'PHI' : 'blue',
//   'IND' : 'blue',
//   'LAL' : 'purple',
//   'GS' : 'lightblue',
//   'SAC' : 'purple',
//   'MIL' : 'green',
//   'DET' : 'red',
//   'LAC' : 'red',
//   'ATL' : 'red',
//   'MEM' : 'blue',
//   'MIA' : 'red',
//   'DAL' : '#4169e1',
//   'CLE' : 'wine',
//   'NY' : 'orange',
//   'BOS' : 'green',
//   'BKN' : 'black',
//   'OKC' : 'blue',
//   'HOU' : 'red',
//   'MIN' : 'blue',
//   'DEN' : '#00004C',
//   'UTA' : 'blue',
//   'POR' : 'black',
//   'ORL' : 'blue',
//   'CHA' : 'teal',
//   'WAS' : 'blue',
//   'SA' : 'silver',
//   'TOR' : 'red'

// }

const fetchNbaUrl = async () => {
  try {
    const fetch = await import('node-fetch');
    const response = await fetch.default(
      'https://api.sportsdata.io/v3/nba/scores/json/Players?key=8ddc4ea9020a49ae9e409c464376fd0e'
    );
    if (!response.ok) {
      throw new Error('failed to get data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching nba data', error);
    return null;
  }
};

const formatNbaUrl = async () => {
  const nbaPlayerData = await fetchNbaUrl();
  // console.log(nbaPlayerData, 'data')
  const obj = {};
  for (let i = 0; i < nbaPlayerData.length; i++) {
    let name = nbaPlayerData[i].FirstName + ' ' + nbaPlayerData[i].LastName;
    const ID = nbaPlayerData[i].StatsPlayerID;
    // const team = nbaPlayerData[i].Team

    obj[name] = {
      image: `https://gannett-cdn.com/content-pipeline-sports-images/sports2/nba/players/${ID}.png?format=png8&auto=webp&width=80`,
      jersey: nbaPlayerData[i].Jersey,
      team: nbaPlayerData[i].Team,
    };
  }

  console.log(obj, 'myobj');

  fs.writeFile(
    path.join(__dirname, 'image.json'),
    JSON.stringify(obj),
    (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    }
  );
};

function formatter() {
  const newData = { ...playerData };

  for (let team in newData) {
    newData[team].forEach((player) => {
      const playertrim = player.name.trim();
      const playerquote = playertrim.replace(/\s{2,}/g, ' ');

      const playerfix = playerquote.replace(/’/g, "'");

      if (playerImage[playerfix]) {
        player.image = playerImage[playerfix].image;
        player.name = playerfix;
        player.jersey = playerImage[playerfix].jersey;
        player.team = playerImage[playerfix].team;
      } else {
        const playerNames = Object.keys(playerImage);

        const { bestMatch } = stringSimilarity.findBestMatch(
          playerfix,
          playerNames
        );

        if (bestMatch.rating > 0.6) {
          const bestMatchName = bestMatch.target;
          console.log(
            `Matched: ${bestMatchName} with rating : ${bestMatch.rating}`
          );
          player.image = playerImage[bestMatchName].image;
        }
      }
    });
  }
  fs.writeFile(
    path.join(__dirname, 'data2.json'),
    JSON.stringify(newData),
    (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    }
  );
}

scraper();
formatNbaUrl();
formatter();

module.exports = scraper;
