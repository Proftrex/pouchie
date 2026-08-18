


const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwxty-tQMITEDPD89trNS6Xo29OjtD6CDqOobaUsWKX7JrwkkbGtinBGYICaZVNI_wA/exec";




function callAppsScript(action, args = []) {

  return fetch(APPS_SCRIPT_URL, {

    method: "POST",

    headers: {
      "Content-Type": "text/plain"
    },

    body: JSON.stringify({

      action: action,

      data: {
        args: args
      }

    })

  })

  .then(function(response){

    return response.text();

  })

  .then(function(text){

    console.log(
      "APPS SCRIPT RAW:",
      text
    );

    return JSON.parse(text);

  });

}

function detectDevice() {

  var isMobile =
    !!window.Capacitor ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth <= 1100;

  document.body.classList.toggle("mobile-device", isMobile);

}

window.addEventListener("load", function() {
  detectDevice();
});

window.addEventListener("resize", function() {
  detectDevice();
});

detectDevice();


/* =========================
   PAGE HISTORY
========================= */

let pageHistory = [];

let currentPage = "dashboard";

/* =========================
   PAGE SWITCH
========================= */

function showPage(page, saveHistory = true) {


  if(
    saveHistory &&
    currentPage &&
    currentPage !== page
  ){

    pageHistory.push(currentPage);

  }


  currentPage = page;

  const dashboard =
    document.getElementById("dashboardPage");

  const assets =
    document.getElementById("assetsPage");

  const liabilities =
    document.getElementById("liabilitiesPage");

  const income =
    document.getElementById("incomePage");

  const savings =
    document.getElementById("savingsPage");

  const cryptocurrencies =
    document.getElementById("cryptocurrenciesPage");

  const bonds =
    document.getElementById("bondsPage");

  const commodities =
    document.getElementById("commoditiesPage");

  const stocks =
    document.getElementById("stocksPage");

  const creditCards =
    document.getElementById("creditCardsPage");

  const loans =
    document.getElementById("loansPage");

  const personalIncome =
    document.getElementById("personalIncomePage");

  const businessIncome =
    document.getElementById("businessIncomePage");


  // =========================
  // UPDATE MOBILE BOTTOM NAV
  // =========================

  document
    .querySelectorAll(".mobile-nav-item")
    .forEach(function(button) {

      button.classList.remove("active");

    });


  /*
   * Only activate the four main tabs.
   * Sub-pages such as Savings, Stocks,
   * Personal Income, etc. do not change
   * the bottom navigation.
   */

  const mainPages = [
    "dashboard",
    "assets",
    "liabilities",
    "income"
  ];


  if(mainPages.indexOf(page) !== -1){

    const activeButton =
      document.querySelector(
        '.mobile-nav-item[data-page="' +
        page +
        '"]'
      );


    if(activeButton){

      activeButton.classList.add("active");

    }

  }


  // =========================
  // HIDE ALL MAIN PAGES
  // =========================

  if (dashboard)
    dashboard.style.display = "none";

  if (assets)
    assets.style.display = "none";

  if (liabilities)
    liabilities.style.display = "none";

  if (income)
    income.style.display = "none";

  if (savings)
    savings.style.display = "none";

  if (cryptocurrencies)
    cryptocurrencies.style.display = "none";

  if (bonds)
    bonds.style.display = "none";

  if (commodities)
    commodities.style.display = "none";

  if (stocks)
    stocks.style.display = "none";

  if (creditCards)
    creditCards.style.display = "none";

  if (loans)
    loans.style.display = "none";

  if (personalIncome)
    personalIncome.style.display = "none";

  if (businessIncome)
    businessIncome.style.display = "none";


  // =========================
  // SHOW SELECTED PAGE
  // =========================

  if (page === "dashboard") {

    if (dashboard)
      dashboard.style.display = "block";

    loadDashboard();

  }


  else if (page === "assets") {

    if (assets)
      assets.style.display = "block";

  }


  else if (page === "liabilities") {

    if (liabilities)
      liabilities.style.display = "block";

  }


  else if (page === "income") {

    if (income)
      income.style.display = "block";

  }


  // =========================
  // ASSET SUB-PAGES
  // =========================

  else if (page === "savings") {

    if (savings)
      savings.style.display = "block";

    loadSavings();

  }


  else if (page === "cryptocurrencies") {

    if (cryptocurrencies)
      cryptocurrencies.style.display = "block";

    loadCryptocurrenciesDashboard();
    loadTransactions();

  }


  else if (page === "bonds") {

    if (bonds)
      bonds.style.display = "block";

    loadBonds();

  }


  else if (page === "commodities") {

    if (commodities)
      commodities.style.display = "block";

    loadCommodities();

  }


  else if (page === "stocks") {

    if (stocks)
      stocks.style.display = "block";

    loadStocks();

  }


  // =========================
  // PERSONAL INCOME
  // =========================

  else if (page === "personalIncome") {

    if (personalIncome)
      personalIncome.style.display = "block";

    loadPersonalIncome();

  }


  // =========================
  // CREDIT CARDS
  // =========================

  else if (page === "creditCards") {

    if (creditCards)
      creditCards.style.display = "block";

    loadCreditCards();

  }


  // =========================
  // LOANS
  // =========================

  else if (page === "loans") {

    if (loans)
      loans.style.display = "block";

    loadLoans();

  }


  // =========================
  // BUSINESS INCOME
  // =========================

  else if (page === "businessIncome") {

    if (businessIncome)
      businessIncome.style.display = "block";

    loadBusinessIncome();

    loadBusinessIncomeSummary();

  }

}



/* =========================
   BACK BUTTON
========================= */

function goBack(){

  if(pageHistory.length > 0){

    const previousPage =
      pageHistory.pop();


    showPage(
      previousPage,
      false
    );

  }

}




/* =========================
   GET PERSONAL INCOME
========================= */

function getPersonalIncome(){

  try{

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();


    const sheet =
      ss.getSheetByName("Personal Income");


    if(!sheet){

      return [];

    }


    const lastRow =
      sheet.getLastRow();


    if(lastRow <= 1){

      return [];

    }


    /*
     * CHECK HEADERS
     */

    let headers =
      sheet
        .getRange(
          1,
          1,
          1,
          sheet.getLastColumn()
        )
        .getValues()[0];


    let idColumn =
      headers.indexOf("ID");


    /*
     * ADD ID COLUMN IF MISSING
     */

    if(idColumn === -1){

      sheet.insertColumnBefore(1);

      sheet
        .getRange(1,1)
        .setValue("ID");


      idColumn = 0;

    }


    /*
     * GET ALL DATA
     */

    const lastColumn =
      sheet.getLastColumn();


    const values =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          lastColumn
        )
        .getValues();


    /*
     * GENERATE IDs FOR OLD RECORDS
     */

    values.forEach(function(row, index){

      if(
        !row[idColumn] ||
        String(row[idColumn]).trim() === ""
      ){

        const newId =
          Utilities.getUuid();


        row[idColumn] =
          newId;


        sheet
          .getRange(
            index + 2,
            idColumn + 1
          )
          .setValue(newId);

      }

    });


    SpreadsheetApp.flush();


    /*
     * RETURN DATA
     *
     * After adding the ID column,
     * the columns are:
     *
     * A = ID
     * B = Date
     * C = Source
     * D = Description
     * E = Amount
     */

    return values.map(function(row){

      return {

        id:
          String(
            row[0] || ""
          ),

        date:
          row[1]
          ?
          Utilities.formatDate(
            new Date(row[1]),
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          )
          :
          "",

        source:
          row[2] || "",

        description:
          row[3] || "",

        amount:
          Number(row[4]) || 0

      };

    });


  }
  catch(error){

    console.error(
      "getPersonalIncome Error:",
      error
    );


    return [];

  }

}

/* =========================
   MODALS
========================= */

function openModal() {
  document.getElementById("transactionModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("transactionModal").style.display = "none";
}

function openSavingsModal() {

  document.getElementById("savingsModal")
  .style.display = "flex";


  loadSavingsBanks();

}

function closeSavingsModal() {
  document.getElementById("savingsModal").style.display = "none";
}

function openBondModal(){

  document.getElementById("bondModal").style.display = "flex";

}


function closeBondModal(){

  document.getElementById("bondModal").style.display = "none";

}



function openWithdrawalModal(){

  document.getElementById("withdrawalModal")
    .style.display = "flex";

  loadAvailableWithdrawalBanks();

}



function closeWithdrawalModal(){

  document.getElementById("withdrawalModal")
    .style.display = "none";

}

/* =========================
   CRYPTO MODAL
========================= */

function openCryptoModal(){

  document.getElementById("cryptoModal")
  .style.display = "flex";

}


function closeCryptoModal(){

  document.getElementById("cryptoModal")
  .style.display = "none";

}





/* =========================
   COMMODITY MODAL
========================= */

function openCommodityModal(){

  document.getElementById("commodityModal")
  .style.display = "flex";

}


function closeCommodityModal(){

  document.getElementById("commodityModal")
  .style.display = "none";

}






/* =========================
   STOCK MODAL
========================= */

function openStockModal(){

  document.getElementById("stockModal")
  .style.display = "flex";

}


function closeStockModal(){

  document.getElementById("stockModal")
  .style.display = "none";

}


/* =========================
   ASSET LIST
========================= */

const assets = {

  Crypto: [
    "Bitcoin (BTC)",
    "Ethereum (ETH)",
    "Solana (SOL)",
    "BNB",
    "XRP",
    "Cardano (ADA)",
    "USDT",
    "USDC"
  ],

  Bonds: [
    "TBills",
    "RTB"
  ],

  Commodities: [
    "Gold",
    "Silver"
  ],

  Stocks: [
    "Apple",
    "Microsoft",
    "Netflix",
    "Tesla",
    "Nvidia",
    "Amazon",
    "Meta",
    "Google"
  ]

};

function loadAssets() {

  const type = document.getElementById("assetType").value;
  const dropdown = document.getElementById("assetName");

  dropdown.innerHTML =
    "<option value=''>Select Asset</option>";

  if (!assets[type]) return;

  assets[type].forEach(asset => {

    const option =
      document.createElement("option");

    option.value = asset;
    option.textContent = asset;

    dropdown.appendChild(option);

  });

}








/* =========================
   EDIT LOAN
========================= */

function editLoan(id){

  callAppsScript("getLoans", [])

    .then(function(loans){

      const loan =
        loans.find(function(item){

          return String(item.id) === String(id);

        });


      if(!loan){

        alert("Loan not found.");

        return;

      }


      // Store ID being edited

      window.editingLoanId =
        loan.id;


      // Fill loan modal fields

      document.getElementById(
        "loanName"
      ).value =
        loan.loanName;


      document.getElementById(
        "loanType"
      ).value =
        loan.loanType;


      document.getElementById(
        "loanDate"
      ).value =
        loan.date;


      document.getElementById(
        "loanOriginalAmount"
      ).value =
        loan.originalAmount;


      document.getElementById(
        "loanOutstandingBalance"
      ).value =
        loan.outstandingBalance;


      // Change modal title

      const title =
        document.querySelector(
          "#loanModal h2"
        );


      if(title){

        title.textContent =
          "Edit Loan";

      }


      // Open modal

      document.getElementById(
        "loanModal"
      ).style.display =
        "flex";

    })

    .catch(function(error){

      console.error(
        "Edit Loan Error:",
        error
      );

    });

}


function submitTransaction() {

  const data = {

    date: document.getElementById("date").value,

    transaction:
      document.getElementById("transactionType").value,

    assetType:
      document.getElementById("assetType").value,

    assetName:
      document.getElementById("assetName").value,

    quantity:
      document.getElementById("quantity").value,

    buyPrice:
      document.getElementById("buyPrice").value

  };


  callAppsScript("saveTransaction", [data])

    .then(function(response){

      if (!response.success) {

        alert(response.message);

        return;

      }


      alert("Transaction Saved");

      closeModal();

      clearTransactionForm();

      loadTransactions();

      loadDashboard();

      loadCryptocurrenciesDashboard();

    })

    .catch(function(error){

      console.error(error);

      alert("Transaction failed.");

    });

}


function clearTransactionForm() {

  document.getElementById("date").value = "";

  if (document.getElementById("transactionType")) {
    document.getElementById("transactionType").value = "Buy";
  }

  document.getElementById("assetType").value = "";

  document.getElementById("assetName").innerHTML =
    "<option value=''>Select Asset</option>";

  document.getElementById("quantity").value = "";

  document.getElementById("buyPrice").value = "";

}



function loadTransactions() {

  callAppsScript("getTransactions", [])

    .then(function (data) {

      const table =
        document.getElementById("cryptoTransactionTable");

      if (!table) return;

      table.innerHTML = "";

      if (!data || data.length === 0) {

        table.innerHTML = `
          <tr>
            <td colspan="6">
              No transactions found
            </td>
          </tr>
        `;

        return;

      }

      data.forEach(function (tx) {

        console.log(
          "TRANSACTION ID:",
          tx.id
        );

        console.log(
          "ASSET TYPE:",
          tx.assetType
        );

        console.log(
          "FULL TRANSACTION:",
          JSON.stringify(tx)
        );

        const row =
          document.createElement("tr");

        row.innerHTML = `

          <td>
            ${tx.date}
          </td>

          <td>
            ${tx.transactionType}
          </td>

          <td>
            ${tx.assetName}
          </td>

          <td>
            ${formatPeso(tx.buyPrice)}
          </td>

          <td>
            ${formatPeso(tx.totalAmount)}
          </td>

          <td>
            <button
              class="delete-btn"
              onclick="deleteTransaction('${tx.id}', '${tx.assetType}')">
              Delete
            </button>
          </td>

        `;

        table.appendChild(row);

      });

    })

    .catch(function (error) {

      console.error(
        "Load Transactions Error:",
        error
      );

    });

}





function deleteTransaction(id, type){

  if(!id){

    console.error(
      "No transaction ID provided."
    );

    return;

  }


  console.log(
    "DELETE REQUEST:",
    {
      id: id,
      type: type
    }
  );


  /*
   * SHOW DELETING
   */

  showTransactionLoading(
    "Deleting transaction..."
  );


  /*
   * SELECT CORRECT DELETE FUNCTION
   */

  const deleteFunction =
    type === "Savings"
      ? "deleteSavings"
      : "deleteTransaction";


  /*
   * DELETE FROM GOOGLE SHEETS
   */

  const args =
    type === "Savings"
      ? [id]
      : [id, type];


  callAppsScript(
    deleteFunction,
    args
  )

    .then(function(response){

      console.log(
        "DELETE RESPONSE:",
        response
      );


      if(
        response &&
        response.success
      ){

        showTransactionSuccess(
          "Transaction deleted successfully."
        );


        /*
         * REFRESH TRANSACTIONS
         */

        loadTransactions();


        /*
         * REFRESH DASHBOARD
         */

        loadDashboard();

        loadCryptocurrenciesDashboard();


        /*
         * REFRESH SAVINGS
         */

        if(
          type === "Savings"
        ){

          loadSavings();

        }


        /*
         * REFRESH OTHER ASSET PAGES
         */

        if(
          type === "Commodities"
        ){

          loadCommodities();

        }


        if(
          type === "Stocks"
        ){

          loadStocks();

        }


        if(
          type === "Bonds"
        ){

          loadBonds();

        }


        if(
          type === "Personal Income"
        ){

          loadPersonalIncome();

        }


        if(
          type === "Business Income"
        ){

          loadBusinessIncome();

        }

      }
      else{

        showTransactionError(

          response &&
          response.message
            ? response.message
            : "Unable to delete transaction."

        );

      }

    })

    .catch(function(error){

      console.error(
        "Delete Transaction Error:",
        error
      );


      showTransactionError(
        "Unable to delete transaction."
      );

    });

}


/* =========================
   DASHBOARD
========================= */


/* =========================
   DASHBOARD
========================= */

function loadDashboard() {

  callAppsScript("getDashboard", [])

    .then(function(data) {

      console.log(
        "========== DASHBOARD DATA =========="
      );

      console.log(
        "FULL DATA:",
        data
      );

      console.log(
        "ASSETS:",
        data && data.assets
      );

      console.log(
        "PORTFOLIO:",
        data && data.portfolio
      );

      console.log(
        "CATEGORIES:",
        data && data.categories
      );

      console.log(
        "NET WORTH:",
        data && data.netWorth
      );

      console.log(
        "===================================="
      );


      if (!data) return;


      renderDashboard(data);

      renderDashboardCryptocurrencies(
        data.categories
      );

      renderDashboardBonds(
        data.categories
      );

      renderDashboardCommodities(
        data.categories
      );

      renderDashboardStocks(
        data.categories
      );

      loadDashboardSavings();

      // Refresh Personal Income dashboard figures
      loadPersonalIncome();

    })

    .catch(function(error) {

      console.error(
        "========== DASHBOARD ERROR =========="
      );

      console.error(
        error
      );

      console.error(
        error && error.message
      );

    });

}


function loadCryptocurrenciesDashboard(){

  callAppsScript("getDashboard", [])

    .then(function(data){

      console.log(
        "CRYPTO DASHBOARD DATA:",
        data
      );

      if(!data) return;

      renderCryptoSummary(data);

      renderCryptoHoldings(data);

    })

    .catch(function(error){

      console.error(
        "Crypto Dashboard Error:",
        error
      );

    });

}


function renderDashboardCryptocurrencies(categories) {

  const container =
    document.getElementById("dashboardCryptocurrenciesCards");

  if (!container) return;

  container.innerHTML = "";


 const displayCategories = [
    "Cryptocurrencies",
    "Stablecoins"
];


  displayCategories.forEach(function(category){


    const assets = (categories || {})[category] || [];


if(assets.length === 0){
  return;
}



    const card =
      document.createElement("div");


    card.className = "asset-card";



    let html = `
      <h2>${category}</h2>
    `;



    assets.forEach(function(asset){


      html += `

        <hr>

        <h3>${asset.assetName}</h3>


        <p>
        Quantity:
        ${Number(asset.quantity).toLocaleString()}
        </p>


        <p>
        Current Value:
        ${formatPeso(asset.currentValue)}
        </p>


        <p class="${asset.pnl >= 0 ? "positive":"negative"}">

        P&L:
        ${asset.pnl >= 0 ? "+" : ""}
        ${formatPeso(asset.pnl)}

        </p>

      `;


    });



    card.innerHTML = html;

    container.appendChild(card);


  });


}






function renderDashboardBonds(categories){

  const container =
    document.getElementById("dashboardBondsCards");

  if(!container) return;

  container.innerHTML = "";

  const assets =
    (categories || {}).Bonds || [];


  if(assets.length === 0){
    return;
  }


  assets.forEach(function(asset){

    const card =
      document.createElement("div");


    card.className =
      "asset-card";


    card.innerHTML = `

      <h3>
        ${asset.bondName || "Bond"}
      </h3>

<p>
Purchase Date:
${asset.purchaseDate || ""}
</p>

<p>
Maturity Date:
${asset.maturityDate || ""}
</p>

      <p>
        Investment:
        ${formatPeso(asset.netInvestment || 0)}
      </p>


      <p>
        Interest:
        ${formatPeso(asset.interestEarned || 0)}
      </p>


      <p>
        Maturity:
        ${formatPeso(asset.maturityValue || 0)}
      </p>

    `;


    container.appendChild(card);

  });

}


function renderBondPortfolio(bonds){

  const container =
    document.getElementById("bondPortfolioCards");


  if(!container) return;


  container.innerHTML = "";


  if(!bonds || bonds.length === 0){

    container.innerHTML = `
      <div class="asset-card">
        No bond holdings yet
      </div>
    `;

    return;

  }



  bonds.forEach(function(bond){


    const isClaimed =
      String(bond.status || "")
      .toLowerCase()
      ===
      "claimed";



    container.innerHTML += `

    <div class="asset-card">

      <h3>
        ${bond.bondName}
      </h3>


      <p>
        Investment:
        ${formatPeso(bond.netInvestment || 0)}
      </p>


      <p>
        Current Value:
        ${formatPeso(bond.currentValue || 0)}
      </p>


      <p class="${bond.pnl >= 0 ? "positive" : "negative"}">

        P&L:
        ${formatPeso(bond.pnl || 0)}

      </p>


      <p>
        Status:
        ${bond.status || "Active"}
      </p>



      ${
        !isClaimed
        ?
        `
        <button 
          class="claim-bond-btn"
          onclick="claimBond('${bond.id}')">

          Claim Bond

        </button>
        `
        :
        `
        <button 
          class="claim-bond-btn"
          disabled>

          Claimed

        </button>
        `
      }


    </div>

    `;


  });


}




function renderDashboardCommodities(categories){

  const container =
    document.getElementById("dashboardCommoditiesCards");


  if(!container) return;


  container.innerHTML = "";


  const assets =
    (categories || {}).Commodities || [];


  if(assets.length === 0){
    return;
  }



  const card =
    document.createElement("div");


  card.className =
    "asset-card";



  let html = `

    <h2>
      Commodities
    </h2>

  `;



  assets.forEach(function(asset){


    html += `

      <hr>


      <h3>
        ${asset.assetName}
      </h3>


      <p>
        Quantity:
        ${Number(asset.quantity).toLocaleString()}
        grams
      </p>


      <p>
        Average Price:
        ${formatPeso(asset.averagePrice)}
      </p>


      <p>
        Current Price:
        ${formatPeso(asset.currentPrice)}
      </p>


      <p>
        Current Value:
        ${formatPeso(asset.currentValue)}
      </p>


      <p class="${asset.pnl >= 0 ? "positive":"negative"}">

        P&L:
        ${asset.pnl >= 0 ? "+" : ""}
        ${formatPeso(asset.pnl)}

      </p>


    `;


  });



  card.innerHTML = html;


  container.appendChild(card);


}





function renderDashboardStocks(categories){

  const container =
    document.getElementById("dashboardStocksCards");


  if(!container) return;


  container.innerHTML = "";


  const assets =
    (categories || {}).Stocks || [];


  assets.forEach(function(asset){


    const card =
      document.createElement("div");


    card.className =
      "asset-card";


    card.innerHTML = `

      <h3>
        ${asset.assetName}
      </h3>


      <p>
        Shares:
        ${Number(asset.quantity).toLocaleString()}
      </p>


      <p>
        Value:
        ${formatPeso(asset.currentValue)}
      </p>


      <p class="${asset.pnl >= 0 ? "positive":"negative"}">

        P&L:
        ${asset.pnl >= 0 ? "+" : ""}
        ${formatPeso(asset.pnl)}

      </p>

    `;


    container.appendChild(card);


  });


}



function renderCryptocurrenciesPortfolio(categories){

  const container =
    document.getElementById("cryptoCards");

  if(!container) return;

  container.innerHTML = "";

  [
  "Cryptocurrencies",
  "Stablecoins"
].forEach(function(category){

    const assets = categories[category];

    if(!assets || assets.length === 0){
      return;
    }

    const card = document.createElement("div");

    card.className = "asset-card";

    let html = `
      <h2>${category}</h2>
    `;


    assets.forEach(function(asset){

      html += `

        <hr>

        <h3>${asset.assetName}</h3>

        <p>
        Quantity:
        ${Number(asset.quantity).toLocaleString()}
        </p>


        <p>
        Average Price:
        ${formatPeso(asset.averagePrice)}
        </p>


        <p>
        Current Price:
        ${formatPeso(asset.currentPrice)}
        </p>


        <p>
        Current Value:
        ${formatPeso(asset.currentValue)}
        </p>


        <p class="${asset.pnl >= 0 ? "positive":"negative"}">

        P&L:
        ${asset.pnl >= 0 ? "+" : ""}
        ${formatPeso(asset.pnl)}

        </p>

      `;

    });


    card.innerHTML = html;

    container.appendChild(card);

  });

}


function refreshPrices() {

  const button =
    document.getElementById("refreshButton");

  if (button) {

    button.disabled = true;
    button.innerHTML = "Updating...";

  }


  callAppsScript("refreshPrices", [])

    .then(function () {

      if (button) {

        button.disabled = false;
        button.innerHTML = "Refresh Prices";

      }


      loadDashboard();

      loadCryptocurrenciesDashboard();

      loadTransactions();

    })

    .catch(function (error) {

      console.error(error);

      if (button) {

        button.disabled = false;
        button.innerHTML = "Refresh Prices";

      }

      alert("Unable to update prices.");

    });

}


function renderCryptoSummary(data){


  const categories =
    data.categories || {};



  const cryptoAssets =
  [
    ...(categories.Cryptocurrencies || []),
    ...(categories.Stablecoins || [])
  ];



  let invested = 0;
  let currentValue = 0;
  let pnl = 0;



  cryptoAssets.forEach(function(asset){

    invested += Number(asset.invested || 0);

    currentValue += Number(asset.currentValue || 0);

    pnl += Number(asset.pnl || 0);

  });



  const investedEl =
    document.getElementById(
      "cryptocurrenciesTotalInvested"
    );


  if(investedEl)
    investedEl.innerHTML =
      formatPeso(invested);



  const currentEl =
    document.getElementById(
      "cryptocurrenciesCurrentValue"
    );


  if(currentEl)
    currentEl.innerHTML =
      formatPeso(currentValue);



  const pnlEl =
    document.getElementById(
      "cryptocurrenciesTotalPnl"
    );


  if(pnlEl){

    pnlEl.innerHTML =
      (pnl >= 0 ? "+" : "") +
      formatPeso(pnl);


    pnlEl.className =
      pnl >= 0
      ? "positive"
      : "negative";

  }



  const assetsEl =
    document.getElementById(
      "cryptocurrenciesTotalAssets"
    );


  if(assetsEl)
    assetsEl.innerHTML =
      cryptoAssets.length;


}



function renderCryptoHoldings(data){


  const container =
    document.getElementById(
      "cryptoCards"
    );


  if(!container){
    return;
  }


  container.innerHTML = "";


  const assets =
  [
    ...(data.categories.Cryptocurrencies || []),
    ...(data.categories.Stablecoins || [])
  ];



  if(assets.length === 0){

    container.innerHTML =
    `
    <p>
    No crypto holdings yet.
    </p>
    `;

    return;

  }



  assets.forEach(function(asset){


    container.innerHTML +=
    `

    <div class="asset-card">


      <h3>
      ${asset.assetName}
      </h3>


      <p>
      Quantity:
      ${asset.quantity}
      </p>


      <p>
      Invested:
      ${formatPeso(asset.invested)}
      </p>


      <p>
      Current Value:
      ${formatPeso(asset.currentValue)}
      </p>


      <p class="${asset.pnl >=0 ? "positive":"negative"}">

      P&L:
      ${formatPeso(asset.pnl)}

      </p>


    </div>

    `;


  });


}



function loadCryptoSummary(){

  callAppsScript("getCryptocurrencies", [])

    .then(function(data){

      let invested = 0;
      let current = 0;
      let pnl = 0;

      (data || []).forEach(function(asset){

        invested += Number(
          asset.invested || 0
        );

        current += Number(
          asset.currentValue || 0
        );

        pnl += Number(
          asset.pnl || 0
        );

      });


      const investedEl =
        document.getElementById(
          "cryptoTotalInvested"
        );

      if(investedEl){

        investedEl.innerHTML =
          formatPeso(invested);

      }


      const currentEl =
        document.getElementById(
          "cryptoCurrentValue"
        );

      if(currentEl){

        currentEl.innerHTML =
          formatPeso(current);

      }


      const pnlEl =
        document.getElementById(
          "cryptoTotalPnl"
        );

      if(pnlEl){

        pnlEl.innerHTML =
          (pnl >= 0 ? "+" : "") +
          formatPeso(pnl);

        pnlEl.className =
          pnl >= 0
            ? "positive"
            : "negative";

      }


      const assetsEl =
        document.getElementById(
          "cryptoTotalAssets"
        );

      if(assetsEl){

        assetsEl.innerHTML =
          (data || []).length;

      }

    })

    .catch(function(error){

      console.error(
        "Crypto Summary Error:",
        error
      );

    });

}


function renderDashboard(data) {

  console.log("========== RENDER DASHBOARD ==========");
  console.log("DATA RECEIVED:", data);
  console.log("DATA ASSETS:", data?.assets);
  console.log("DATA PORTFOLIO:", data?.portfolio);
  console.log("DATA CATEGORIES:", data?.categories);
  console.log("DATA NET WORTH:", data?.netWorth);
  console.log("======================================");


  if (!data) {
    console.error("Dashboard received NO DATA.");
    return;
  }


  /* =========================
     INVESTMENT SUMMARY
  ========================= */

  const invested =
    document.getElementById("dashboardInvested");

  if (invested) {

    invested.textContent =
      formatPeso(
        data.summary?.invested || 0
      );

  }


  const currentValue =
    document.getElementById("dashboardCurrentValue");

  if (currentValue) {

    currentValue.textContent =
      formatPeso(
        data.summary?.currentValue || 0
      );

  }


  const pnl =
    document.getElementById("dashboardPnL");

  if (pnl) {

    const value =
      Number(data.summary?.pnl) || 0;

    pnl.textContent =
      (value >= 0 ? "+" : "") +
      formatPeso(value);

  }


  const pnlPercentage =
    document.getElementById(
      "dashboardPnLPercentage"
    );

  if (pnlPercentage) {

    pnlPercentage.textContent =
      (
        Number(
          data.summary?.pnlPercentage
        ) || 0
      ).toFixed(2) + "%";

  }


  const assetsCount =
    document.getElementById(
      "dashboardAssets"
    );

  if (assetsCount) {

    assetsCount.textContent =
      data.summary?.assets || 0;

  }


  /* =========================
     NET WORTH
  ========================= */

  const netWorth =
    document.getElementById("netWorth");

  if (netWorth) {

    netWorth.textContent =
      formatPeso(
        data.assets?.netWorth ||
        data.netWorth ||
        0
      );

  }


  /* =========================
     ASSET ALLOCATION
  ========================= */

  const values = {

    dashboardSavings:
      data.assets?.savings || 0,

    dashboardCryptocurrencies:
      data.assets?.cryptocurrencies || 0,

    dashboardBonds:
      data.assets?.bonds || 0,

    dashboardCommodities:
      data.assets?.commodities || 0,

    dashboardStocks:
      data.assets?.stocks || 0

  };


  Object.keys(values).forEach(function(id) {

    const element =
      document.getElementById(id);

    if (element) {

      element.textContent =
        formatPeso(
          Number(values[id]) || 0
        );

    }

  });


  /* =========================
     INCOME
  ========================= */

  const personalIncome =
    document.getElementById(
      "dashboardPersonalIncome"
    );

  if (personalIncome) {

    personalIncome.textContent =
      formatPeso(
        data.income?.personal?.monthly || 0
      );

  }


  const businessIncome =
    document.getElementById(
      "dashboardBusinessIncome"
    );

  if (businessIncome) {

    businessIncome.textContent =
      formatPeso(
        data.income?.business?.monthly || 0
      );

  }


  const totalIncome =
    document.getElementById(
      "dashboardTotalIncome"
    );

  if (totalIncome) {

    totalIncome.textContent =
      formatPeso(
        data.income?.total?.monthly || 0
      );

  }


  const yearlyIncome =
    document.getElementById(
      "dashboardYearlyIncome"
    );

  if (yearlyIncome) {

    yearlyIncome.textContent =
      formatPeso(
        data.income?.total?.yearly || 0
      );

  }


  /* =========================
     LARGEST ASSET
  ========================= */

  const assetValues = [

    {
      name: "Savings",
      value:
        Number(data.assets?.savings) || 0
    },

    {
      name: "Cryptocurrencies",
      value:
        Number(data.assets?.cryptocurrencies) || 0
    },

    {
      name: "Government Bonds",
      value:
        Number(data.assets?.bonds) || 0
    },

    {
      name: "Gold & Silver",
      value:
        Number(data.assets?.commodities) || 0
    },

    {
      name: "Stocks",
      value:
        Number(data.assets?.stocks) || 0
    }

  ];


  assetValues.sort(function(a, b) {

    return b.value - a.value;

  });


  const largest =
    assetValues[0];


  const largestElement =
    document.getElementById(
      "dashboardLargestAsset"
    );

  if (largestElement) {

    if (largest && largest.value > 0) {

      largestElement.textContent =
        largest.name +
        " · " +
        formatPeso(largest.value);

    } else {

      largestElement.textContent =
        "No assets yet";

    }

  }


  /* =========================
     BEST PERFORMING ASSET
  ========================= */

  const bestElement =
    document.getElementById(
      "dashboardBestAsset"
    );


  if (bestElement) {

    const best =
      data.insights?.bestPerformingAsset;


    if (best) {

      bestElement.textContent =
        best.assetName +
        " · " +
        (
          Number(best.pnl) >= 0
            ? "+"
            : ""
        ) +
        formatPeso(
          Number(best.pnl) || 0
        );

    } else {

      bestElement.textContent =
        "No gains yet";

    }

  }


  console.log(
    "Dashboard successfully rendered."
  );

}




function loadDashboardSavings() {

  callAppsScript(
    "getSavingsSummary",
    []
  )

    .then(function (data) {

      const container =
        document.getElementById("dashboardSavingsCards");


      if (!container) return;


      container.innerHTML = "";



      /*
      =========================
      CASH CARD
      =========================
      */


      let cash =
        document.createElement("div");


      cash.className = "asset-card";


      cash.innerHTML = `

        <h2>Cash</h2>

        <h3>
          ${formatPeso(data.cash.total)}
        </h3>


        <p>
          Increase (30 Days):
          <strong class="${data.cash.change30 >= 0 ? "positive" : "negative"}">

            ${data.cash.change30 >= 0 ? "+" : ""}
            ${formatPeso(data.cash.change30)}

          </strong>
        </p>

      `;


      container.appendChild(cash);





      /*
      =========================
      DIGITAL CASH CARD
      =========================
      */


      let digital =
        document.createElement("div");


      digital.className = "asset-card";



      let html = `

        <h2>Digital Cash</h2>


        <h3>
          ${formatPeso(data.digital.total)}
        </h3>


        <p>
          Increase (30 Days):
          <strong class="${data.digital.change30 >= 0 ? "positive" : "negative"}">

            ${data.digital.change30 >= 0 ? "+" : ""}
            ${formatPeso(data.digital.change30)}

          </strong>
        </p>

      `;



      Object.keys(data.digital.banks || {})
        .sort()
        .forEach(function(bank){


          const info =
            data.digital.banks[bank];



          html += `

            <hr>


            <h3>
              ${bank}
            </h3>


            <p>
              Total:
              ${formatPeso(info.total)}
            </p>


            <p>
              30 Days:
              <strong class="${info.increase30 >= 0 ? "positive" : "negative"}">

                ${info.increase30 >= 0 ? "+" : ""}
                ${formatPeso(info.increase30)}

              </strong>
            </p>


          `;


        });



      digital.innerHTML = html;


      container.appendChild(digital);



    })


    .catch(function(error){

      console.error(
        "Savings Dashboard Error:",
        error
      );

    });


}

/* =========================
   HELPERS
========================= */

function formatPeso(value) {

  value = Number(value) || 0;

  const absValue = Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return value < 0 ? "-₱" + absValue : "₱" + absValue;

}

/* =========================
   SAVINGS
========================= */

function loadSavings(){

  loadSavingsSummary();

  loadSavingsTransactions();

}

function loadSavingsBanks() {

  callAppsScript("getSavingsBanks", [])
    .then(function(banks) {

      const bankDropdown = document.getElementById("savingsBank");

      if (!bankDropdown) return;

      bankDropdown.innerHTML =
        '<option value="">Select Bank / Wallet</option>';

      banks.forEach(function(bank) {

        bankDropdown.innerHTML += `
          <option value="${bank}">
            ${bank}
          </option>
        `;

      });

    })
    .catch(function(error) {
      console.error("Savings Banks Error:", error);
    });

}

/* =========================
   SAVINGS MODE TOGGLE
========================= */
function toggleSavingsBank(){

  const mode =
    document.getElementById("savingsMode").value;

  const bankField =
    document.getElementById("bankField");

  const bankDropdown =
    document.getElementById("savingsBank");

  if(!bankField){
    console.error("bankField not found");
    return;
  }

  if(mode === "Digital Cash"){

    bankField.style.display = "block";

    loadSavingsBanks();   // <-- ADD THIS LINE

  }
  else{

    bankField.style.display = "none";

    if(bankDropdown){
      bankDropdown.value = "";
    }

  }

}



/* =========================
   WITHDRAWAL MODE TOGGLE
========================= */

function toggleWithdrawalBank(){

  const mode =
    document.getElementById("withdrawalMode").value;


  const field =
    document.getElementById("withdrawalBankField");


  if(!field) return;


  if(mode === "Digital Cash"){

    field.style.display = "block";

    loadAvailableWithdrawalBanks();

  }
  else{

    field.style.display = "none";

    document.getElementById("withdrawalBank").value="";

  }

}


/* =========================
   LOAD AVAILABLE WITHDRAWAL SOURCES
========================= */

function loadAvailableWithdrawalBanks(){


  callAppsScript(
    "getAvailableWithdrawalBanks",
    []
  )

  .then(function(data){


    const dropdown =
      document.getElementById("withdrawalBank");


    if(!dropdown) return;



    dropdown.innerHTML =
    `
    <option value="">
      Select Source
    </option>
    `;



    if(!data || data.length === 0){

      dropdown.innerHTML +=
      `
      <option disabled>
        No available savings
      </option>
      `;

      return;

    }



    data.forEach(function(item){


      const option =
        document.createElement("option");


      /*
        Store the actual source name
        used by saveWithdrawal()
      */

      option.value =
        item.bank;



      let label =
        item.bank;



      if(item.sourceType === "Digital Cash"){

        label += " (Digital Cash)";

      }
      else if(item.sourceType === "Cash"){

        label += " (Cash)";

      }



      label +=
        " - ₱" +
        Number(item.balance)
        .toLocaleString(undefined,{
          minimumFractionDigits:2,
          maximumFractionDigits:2
        });



      option.textContent =
        label;



      dropdown.appendChild(option);



    });



  })


  .catch(function(error){

    console.error(
      "Withdrawal source loading error:",
      error
    );

  });


}

function loadSavingsSummary(){

  callAppsScript("getSavingsSummary", [])

    .then(function(data){


      const container =
        document.getElementById("savingsCards");

      if(!container || !data) return;


      container.innerHTML = "";


      const cash = `

        <div class="asset-card">

          <h2>Cash</h2>

          <h3>
            ${formatPeso(data.cash.total)}
          </h3>

          <p>
  30 Day Increase:
  <strong class="${data.cash.increase30 >= 0 ? "positive" : "negative"}">
    ${data.cash.increase30 >= 0 ? "+" : ""}
    ${formatPeso(data.cash.increase30)}
  </strong>
</p>

        </div>

      `;



      let digital = `

        <div class="asset-card">

          <h2>Digital Cash</h2>

          <h3>
            ${formatPeso(data.digital.total)}
          </h3>

          <p>
  30 Day Increase:
  <strong class="${data.digital.increase30 >= 0 ? "positive" : "negative"}">
    ${data.digital.increase30 >= 0 ? "+" : ""}
    ${formatPeso(data.digital.increase30)}
  </strong>
</p>

      `;



      Object.keys(data.digital.banks || {})
      .forEach(function(bank){

        const info =
          data.digital.banks[bank];


        digital += `

  <hr>

  <h3>${bank}</h3>

  <p>
    Total:
    ${formatPeso(info.total)}
  </p>


  <p>
    30 Day Increase:

    <strong class="${info.increase30 >= 0 ? "positive" : "negative"}">

      ${info.increase30 >= 0 ? "+" : ""}
      ${formatPeso(info.increase30)}

    </strong>

  </p>

`;

      });



      digital += "</div>";


      container.innerHTML =
        cash + digital;


    })


    .catch(function(error){

      console.error(
        "Savings Summary Error:",
        error
      );

    });


}






function loadSavingsTransactions(){

  callAppsScript("getSavingsTransactions", [])

    .then(function(data){

      console.log(
        "Savings Transactions:",
        data
      );


      const table =
        document.getElementById(
          "savingsTransactionTable"
        );


      if(!table){

        console.error(
          "savingsTransactionTable not found"
        );

        return;

      }


      table.innerHTML = "";


      if(
        !data ||
        data.length === 0
      ){

        table.innerHTML = `

          <tr>

            <td colspan="6">
              No transactions found
            </td>

          </tr>

        `;

        return;

      }


      data.forEach(function(tx){

        table.innerHTML += `

          <tr>

            <td>
              ${tx.date || ""}
            </td>


            <td>
              ${tx.transaction || ""}
            </td>


            <td>
              ${tx.mode || "-"}
            </td>


            <td>
              ${tx.bank || "-"}
            </td>


            <td
              class="${tx.amount >= 0 ? "positive" : "negative"}"
              style="font-weight:400 !important;"
            >

              ${tx.amount >= 0 ? "+" : ""}
              ${formatPeso(tx.amount)}

            </td>


            <td>

              <button
                class="delete-btn"
                onclick="deleteTransaction('${tx.id}', 'Savings')"
              >
                Delete
              </button>

            </td>


          </tr>

        `;

      });

    })

    .catch(function(error){

      console.error(
        "Savings Transactions Error:",
        error
      );

    });

}


function submitSavings(){

  const data = {

    date:
      document.getElementById("savingsDate").value,

    mode:
      document.getElementById("savingsMode").value,

    bank:
      document.getElementById("savingsBank").value,

    amount:
      Number(
        document.getElementById("savingsAmount").value
      )

  };


  if(
    !data.date ||
    !data.mode ||
    data.amount <= 0
  ){

    alert("Please complete savings details.");

    return;

  }



  // SHOW LOADING MODAL
  showTransactionLoading();



  callAppsScript(
    "saveSavings",
    [data]
  )

  .then(function(response){

    console.log(
      "SAVE SAVINGS RESPONSE:",
      response
    );


    if(
      !response ||
      !response.success
    ){

      showTransactionError(
        response.message ||
        "Failed saving savings"
      );

      return;

    }


    showTransactionSuccess();


    closeSavingsModal();


    loadSavings();

    loadDashboard();


  })

  .catch(function(error){

    console.error(
      "Savings Error:",
      error
    );


    showTransactionError(
      "Failed saving savings"
    );


  });


}





function submitWithdrawal(){


  const data = {

    date:
      document.getElementById("withdrawalDate").value,


    mode:
      document.getElementById("withdrawalMode").value,


    bank:
      document.getElementById("withdrawalBank").value,


    amount:
      Number(
        document.getElementById("withdrawalAmount").value
      )

  };


  console.log(
    "WITHDRAWAL DATA:",
    data
  );



  if(
    !data.date
  ){

    alert("Please select withdrawal date.");
    return;

  }


  if(
    !data.mode
  ){

    alert("Please select withdrawal mode.");
    return;

  }


  if(
    data.mode === "Digital Cash" &&
    !data.bank
  ){

    alert("Please select bank/wallet.");
    return;

  }


  if(
    data.amount <= 0 || isNaN(data.amount)
  ){

    alert(
      "Withdrawal amount must be greater than zero."
    );

    return;

  }




  // SHOW LOADING MODAL
  showTransactionLoading();



  callAppsScript(
    "saveBond",
    [data]
  )

  .then(function(response){


    console.log(
      "Withdrawal Response:",
      response
    );



    if(!response.success){


      showTransactionError(
        response.message
      );


      return;


    }



    // SHOW SUCCESS MODAL
    showTransactionSuccess();



    closeWithdrawalModal();


    loadSavings();

    loadDashboard();



  })


  .withFailureHandler(function(error){


    console.error(
      "Withdrawal Error:",
      error
    );


    showTransactionError(
      "Failed saving withdrawal"
    );


  })


  .saveWithdrawal(data);



}










/* =========================
   CRYPTO TRANSACTION
========================= */

function submitCrypto(){

  const data = {

    date:
      document.getElementById("cryptoDate").value,

    transactionType:
      document.getElementById("cryptoTransactionType").value,

    assetType:
      "Crypto",

    assetName:
      document.getElementById("cryptoName").value,

    quantity:
      Number(document.getElementById("cryptoQuantity").value),

    buyPrice:
      Number(document.getElementById("cryptoBuyPrice").value)

  };


  if(
    !data.date ||
    !data.assetName ||
    data.quantity <= 0 ||
    data.buyPrice <= 0
  ){

    alert("Please complete cryptocurrency details.");

    return;

  }



  // SHOW LOADING MODAL
  showTransactionLoading();



  callAppsScript(
    "saveTransaction",
    [data]
  )

  .then(function(response){

    console.log(
      "SAVE CRYPTO RESPONSE:",
      response
    );


    if(
      !response ||
      !response.success
    ){

      showTransactionError(
        response.message ||
        "Failed saving cryptocurrency"
      );

      return;

    }


    showTransactionSuccess();


    closeCryptoModal();


    loadCryptocurrenciesDashboard();

    loadTransactions();

    loadDashboard();


  })

  .catch(function(error){

    console.error(
      "Crypto Error:",
      error
    );


    showTransactionError(
      "Failed saving cryptocurrency"
    );


  });


}

/* =========================
   COMMODITY TRANSACTION
========================= */

function submitCommodity(){

  console.log("NEW SUBMIT COMMODITY RUNNING");


  const data = {


    date:
      document.getElementById("commodityDate").value,


    transactionType:
      document.getElementById("commodityTransactionType").value,


    assetType:
      "Commodities",


    assetName:
      document.getElementById("commodityName").value,


    quantity:
      Number(
        document.getElementById("commodityQuantity").value
      ),


    buyPrice:
      Number(
        document.getElementById("commodityBuyPrice").value
      ),


    unit:
      "gram"

  };



  console.log(
    "COMMODITY DATA:",
    data
  );



  if(
    !data.date ||
    !data.assetName ||
    data.quantity <= 0 ||
    data.buyPrice <= 0
  ){

    alert(
      "Please complete commodity details."
    );

    return;

  }



  // SHOW LOADING MODAL

  showTransactionLoading();



  callAppsScript(
    "saveCommodity",
    [data]
  )

  .then(function(response){

    console.log(
      "Commodity Response:",
      response
    );


    if(
      !response ||
      !response.success
    ){

      showTransactionError(
        response?.message ||
        "Unable to save commodity"
      );

      return;

    }


    showTransactionSuccess();


    closeCommodityModal();


    console.log("BEFORE LOAD COMMODITIES");

    loadCommodities();

    console.log("BEFORE LOAD DASHBOARD");

    loadDashboard();

    console.log("AFTER DASHBOARD");


  })

  .catch(function(error){

    console.error(
      "Commodity Error:",
      error
    );


    showTransactionError(
      error.message || "Failed saving commodity"
    );


  });


}



/* =========================
   STOCK TRANSACTION
========================= */

function submitStock(){

  console.log("Stock button clicked");


  const data = {

    date:
      document.getElementById("stockDate").value,


    transactionType:
      document.getElementById("stockTransactionType").value,


    assetType:
      "Stocks",


    assetName:
      document.getElementById("stockName").value,


    quantity:
      Number(
        document.getElementById("stockQuantity").value
      ),


    buyPrice:
      Number(
        document.getElementById("stockBuyPrice").value
      )

  };



  console.log(
    "STOCK DATA:",
    data
  );



  if(
    !data.date ||
    !data.assetName ||
    data.quantity <= 0 ||
    data.buyPrice <= 0
  ){

    alert(
      "Please complete stock details."
    );

    return;

  }



  // SHOW LOADING MODAL

  showTransactionLoading();



  callAppsScript(
    "saveStock",
    [data]
  )

  .then(function(response){

    console.log(
      "Stock Save Response:",
      response
    );


    if(
      !response ||
      !response.success
    ){

      showTransactionError(
        response?.message ||
        "Unable to save stock"
      );

      return;

    }


    showTransactionSuccess();


    closeStockModal();


    loadStocks();

    loadDashboard();


  })

  .catch(function(error){

    console.error(
      "Stock Error:",
      error
    );


    showTransactionError(
      error.message || "Failed saving stock"
    );


  });


}


function loadAvailableCommoditiesForSell(){

  callAppsScript(
    "getPortfolio",
    []
  )

  .then(function(portfolio){

    const dropdown =
      document.getElementById("commodityName");


    if(!dropdown) return;


    dropdown.innerHTML =
    "<option value=''>Select Commodity</option>";



    Object.keys(portfolio || {})
    .forEach(function(key){


      const asset =
        portfolio[key];


      if(
        asset.assetType === "Commodities" &&
        Number(asset.quantity) > 0
      ){


        const option =
          document.createElement("option");


        option.value =
          asset.assetName;


        option.textContent =
          asset.assetName +
          " (" +
          asset.quantity +
          " grams)";


        dropdown.appendChild(option);


      }


    });


  })


  .catch(function(error){

    console.error(
      "Loading commodities failed:",
      error
    );

  });


}



function commodityTransactionChanged(){

  const type =
    document.getElementById(
      "commodityTransactionType"
    ).value;


  const dropdown =
    document.getElementById(
      "commodityName"
    );


  if(type === "Sell"){

    loadAvailableCommoditiesForSell();

  }
  else{


    dropdown.innerHTML = `

    <option value="">
    Select Commodity
    </option>

    <option value="Gold">
    Gold
    </option>

    <option value="Silver">
    Silver
    </option>

    `;


  }

}



function loadAvailableStocksForSell(){

  callAppsScript(
    "getPortfolio",
    []
  )

  .then(function(portfolio){


    const dropdown =
      document.getElementById("stockName");


    if(!dropdown) return;


    dropdown.innerHTML =
      "<option value=''>Select Stock</option>";



    console.log("Portfolio received:", portfolio);



    Object.keys(portfolio || {}).forEach(function(key){


      const asset =
        portfolio[key];


      if(
        asset.assetType === "Stocks"
        &&
        Number(asset.quantity) > 0
      ){


        const option =
          document.createElement("option");


        option.value =
          asset.assetName;


        option.textContent =
          asset.assetName +
          " (" +
          asset.quantity +
          " shares)";


        dropdown.appendChild(option);


      }


    });


  })


  .withFailureHandler(function(error){

    console.error(
      "Loading stocks failed:",
      error
    );

  })


  .getPortfolio();


}





function normalizeAssetTypeClient(type){

  if(!type){
    return "";
  }


  let value =
    String(type)
    .trim()
    .toLowerCase();


  if(
    value === "stock" ||
    value === "stocks"
  ){

    return "Stocks";

  }


  if(
    value === "crypto" ||
    value === "cryptocurrency" ||
    value === "cryptocurrencies"
  ){

    return "Crypto";

  }


  if(
    value === "commodity" ||
    value === "commodities"
  ){

    return "Commodities";

  }


  if(
    value === "bond" ||
    value === "bonds"
  ){

    return "Bonds";

  }


  return type;

}



function stockTransactionChanged(){

  const type =
    document.getElementById(
      "stockTransactionType"
    ).value;



  if(type === "Sell"){

    loadAvailableStocksForSell();

  }
  else{

    const dropdown =
      document.getElementById(
        "stockName"
      );


    dropdown.innerHTML =
      `
      <option value="">
      Select Stock
      </option>

      <option>Apple</option>
      <option>Microsoft</option>
      <option>Netflix</option>
      <option>Tesla</option>
      <option>Nvidia</option>
      <option>Amazon</option>
      <option>Meta</option>
      <option>Google</option>
      `;

  }

}


function loadCommoditySummary(){

  callAppsScript(
    "getCommodities",
    []
  )

  .then(function(data){

    let invested = 0;
    let current = 0;
    let pnl = 0;


    (data || []).forEach(function(asset){


      invested += Number(
        asset.invested ||
        asset.totalInvested ||
        asset.investment ||
        0
      );


      current += Number(
        asset.currentValue ||
        0
      );


      pnl += Number(
        asset.pnl ||
        0
      );


    });



    const investedEl =
      document.getElementById(
        "commodityTotalInvested"
      );


    if(investedEl){

      investedEl.innerHTML =
        formatPeso(invested);

    }



    const currentEl =
      document.getElementById(
        "commodityCurrentValue"
      );


    if(currentEl){

      currentEl.innerHTML =
        formatPeso(current);

    }



    const pnlEl =
      document.getElementById(
        "commodityTotalPnl"
      );


    if(pnlEl){

      pnlEl.innerHTML =
        (pnl >= 0 ? "+" : "") +
        formatPeso(pnl);


      pnlEl.className =
        pnl >= 0
        ? "positive"
        : "negative";

    }



    const assetsEl =
      document.getElementById(
        "commodityTotalAssets"
      );


    if(assetsEl){

      assetsEl.innerHTML =
        (data || []).length;

    }



  })


  .catch(function(error){

    console.error(
      "Commodity Summary Error:",
      error
    );

  });

}





/* =========================
   BONDS
========================= */


function submitBond(){

  const data = {

  
    bondType:
      document.getElementById("bondType").value.trim(),

    bondName:
      document.getElementById("bondName").value.trim(),

    purchaseDate:
      document.getElementById("bondDate").value,

    amount:
      Number(
        document.getElementById("bondAmount").value
      ),

    fees:
      Number(
        document.getElementById("bondFees").value || 0
      ),

    apy:
      Number(
        document.getElementById("bondAPY").value
      )

  };


  console.log(
    "Bond Data:",
    data
  );


  if(
    !data.bondType ||
    !data.purchaseDate ||
    data.amount <= 0 ||
    data.apy <= 0
  ){

    alert(
      "Please complete all bond details."
    );

    return;

  }



  // SHOW LOADING CARD

  showTransactionLoading();



  callAppsScript(
    "saveBond",
    [data]
  )

  .then(function(response){


    console.log(
      "Bond Response:",
      response
    );



    if(!response || !response.success){


      showTransactionError(
        response?.message ||
        "Unable to save bond"
      );


      return;

    }



    // SHOW SUCCESS CARD

    showTransactionSuccess();



    closeBondModal();


    clearBondForm();


    loadBonds();

    loadDashboard();


  })


  .catch(function(error){


    console.error(
      "Bond Error:",
      error
    );


    showTransactionError(
      error.message || "Failed saving bond"
    );


  });


}


function clearBondForm(){

  const fields = [
    "bondType",
    "bondName",
    "bondDate",
    "bondAmount",
    "bondAPY"
  ];


  fields.forEach(function(id){

    const el =
      document.getElementById(id);

    if(el){
      el.value = "";
    }

  });


  const fees =
    document.getElementById("bondFees");


  if(fees){
    fees.value = "0";
  }


}





function loadBonds(){


  callAppsScript(
    "getBonds",
    []
  )

  .then(function(data){


    const container =
      document.getElementById("bondCards");


    if(!container) return;


    container.innerHTML = "";



    if(!data || data.length === 0){

      container.innerHTML = `

        <div class="asset-card">

          <h3>
            No bonds yet
          </h3>

        </div>

      `;

      return;

    }



    const grouped = {};



    data.forEach(function(bond){


      if(!grouped[bond.bondType]){

        grouped[bond.bondType] = [];

      }


      grouped[bond.bondType].push(bond);


    });




    let html = "";



    Object.keys(grouped)
    .forEach(function(type){


      html += `

      <div class="asset-card">

        <h2>
          ${type}
        </h2>

      `;



      grouped[type]
      .forEach(function(bond){


        html += `

          <hr>

          <h3>
            ${bond.bondName}
          </h3>


          <p>
            Investment:
            ${formatPeso(bond.netInvestment)}
          </p>


          <p>
            APY:
            ${bond.apy}%
          </p>


          <p>
            Purchase Date:
            ${bond.purchaseDate || ""}
          </p>


          <p>
            Maturity Date:
            ${bond.maturityDate || ""}
          </p>


          <p>
            Interest Earned:
            ${formatPeso(bond.interestEarned)}
          </p>


          <p>
            Maturity Value:
            ${formatPeso(bond.maturityValue)}
          </p>


          <p>
            Status:
            <span class="${bond.status === "Active" ? "bond-active" : "bond-matured"}">
              ${bond.status}
            </span>
          </p>



          ${
          bond.status === "Active"
          ?
          `
          <button 
          class="claim-bond-btn"
          onclick="claimBond('${bond.id}')">

          🏛️ CLAIM BONDS

          </button>
          `
          :
          ``
          }


        `;


      });



      html += `

      </div>

      `;


    });



    container.innerHTML = html;



  })


  .catch(function(error){

    console.error(
      "Bond Loading Error:",
      error
    );

  });







  callAppsScript(
    "getBondSummary",
    []
  )

  .then(function(summary){


    console.log(
      "Bond Summary:",
      summary
    );



    if(!summary) return;



    const total =
      document.getElementById(
        "bondTotalInvestment"
      );


    if(total)
      total.innerHTML =
        formatPeso(summary.totalInvestment);



    const interest =
      document.getElementById(
        "bondInterestEarned"
      );


    if(interest)
      interest.innerHTML =
        formatPeso(summary.projectedInterest);



    const maturity =
      document.getElementById(
        "bondMaturityValue"
      );


    if(maturity)
      maturity.innerHTML =
        formatPeso(summary.maturityValue);



    const active =
      document.getElementById(
        "bondActiveCount"
      );


    if(active)
      active.innerHTML =
        summary.active || 0;



  })


  .catch(function(error){

    console.error(
      "Bond Summary Error:",
      error
    );

  });


  loadBondTransactions();


}




function claimBond(bondId){

  console.log("CLICKED BOND ID:", bondId);

  showTransactionLoading();


  callAppsScript(
    "claimBond",
    [bondId]
  )

  .then(function(response){

    console.log("CLAIM RESPONSE:", response);


    if(!response.success){

      showTransactionError(response.message);

      return;

    }


    showTransactionSuccess();

    loadBonds();

    loadDashboard();


  })


  .catch(function(error){

    console.error(
      "Claim Bond Error:",
      error
    );


    showTransactionError(
      "Unable to claim bond."
    );

  });

}




/* =========================
   LOAD BOND TRANSACTIONS
========================= */

function loadBondTransactions(){

  callAppsScript(
    "getBondTransactions",
    []
  )

  .then(function(data){

      console.log(
        "Bond Transactions:",
        data
      );


      const table =
        document.getElementById(
          "bondTransactionTable"
        );


      if(!table){

        console.error(
          "bondTransactionTable not found"
        );

        return;

      }


      table.innerHTML = "";


      if(
        !data ||
        data.length === 0
      ){

        table.innerHTML = `

          <tr>

            <td colspan="6">
              No bond transactions yet
            </td>

          </tr>

        `;

        return;

      }


      data.forEach(function(tx){

        table.innerHTML += `

          <tr>

            <td>
              ${tx.date || ""}
            </td>


            <td>
              ${tx.transactionType || "BUY"}
            </td>


            <td>
              ${tx.bondName || ""}
            </td>


            <td>
              ${formatPeso(
                Number(tx.amount) || 0
              )}
            </td>


            <td>
              ${formatPeso(
                Number(tx.fees) || 0
              )}
            </td>


            <td>
              ${tx.apy || 0}%
            </td>


            <td>

              <button
                type="button"
                class="delete-btn"
                onclick="deleteBondTransaction('${tx.id}')">

                 Delete

              </button>

            </td>


          </tr>

        `;

      });


    })


    .catch(function(error){

      console.error(
        "Bond Transaction Loading Error:",
        error
      );

    });

}



/* =========================
   DELETE BOND TRANSACTION
========================= */

function deleteBondTransaction(id){

  console.log(
    "BOND DELETE CLICKED:",
    id
  );


  if(!id){

    console.error(
      "No Bond ID provided."
    );

    showTransactionError(
      "Bond ID is missing."
    );

    return;

  }


  showTransactionLoading(
    "Deleting bond..."
  );


  callAppsScript("deleteBond", [id])

    .then(function(response){

      console.log(
        "BOND DELETE RESPONSE:",
        response
      );


      if(
        response &&
        response.success
      ){

        showTransactionSuccess(
          "Bond deleted successfully."
        );


        loadBonds();

        loadDashboard();

        loadBondTransactions();

      }
      else{

        showTransactionError(
          response && response.message
            ? response.message
            : "Unable to delete bond."
        );

      }

    })

    .catch(function(error){

      console.error(
        "Bond Delete Error:",
        error
      );


      showTransactionError(
        "Unable to delete bond."
      );

    });

}


/* =========================
   COMMODITIES
========================= */



function loadCommodities(){


  try{


    loadCommoditySummary();


    loadCommodityTransactions();


  }
  catch(e){

    console.error(
      "Commodity section error:",
      e
    );

  }



  callAppsScript(
    "getCommodities",
    []
  )

  .then(function(data){


    const container =
      document.getElementById("commodityCards");


    if(!container){
      console.error("commodityCards not found");
      return;
    }


    container.innerHTML = "";


    if(!data || data.length === 0){

      container.innerHTML = `

        <div class="asset-card">

          <h3>
            No commodities yet
          </h3>

        </div>

      `;

      return;

    }


    let html = "";


    data.forEach(function(asset){


      html += `

      <div class="asset-card">

        <h2>
          ${asset.assetName}
        </h2>

        <p>
          Quantity:
          ${Number(asset.quantity).toLocaleString()}
        </p>

        <p>
          Average Price:
          ${formatPeso(asset.averagePrice)}
        </p>

        <p>
          Current Price:
          ${formatPeso(asset.currentPrice)}
        </p>

        <p>
          Current Value:
          ${formatPeso(asset.currentValue)}
        </p>

        <p class="${asset.pnl >= 0 ? "positive" : "negative"}">

          P&L:
          ${asset.pnl >= 0 ? "+" : ""}
          ${formatPeso(asset.pnl)}

        </p>

      </div>

      `;

    });


    container.innerHTML = html;


  })

  .catch(function(error){

    console.error(
      "Commodity Loading Error:",
      error
    );

  });


}





function loadCommodityTransactions(){

  callAppsScript(
    "getCommodityTransactions",
    []
  )

  .then(function(data){

      console.log(
        "Commodity Transactions:",
        data
      );


      const table =
        document.getElementById(
          "commodityTransactionTable"
        );


      if(!table){

        console.error(
          "commodityTransactionTable not found"
        );

        return;

      }


      table.innerHTML = "";


      if(!data || data.length === 0){

        table.innerHTML = `

          <tr>

            <td colspan="6">
              No transactions found
            </td>

          </tr>

        `;

        return;

      }


      let html = "";


      data.forEach(function(tx){

        console.log(
          "COMMODITY TRANSACTION:",
          tx
        );


        html += `

          <tr>

            <td>
              ${tx.date || ""}
            </td>


            <td>
              ${tx.transactionType || ""}
            </td>


            <td>
              ${tx.assetName || ""}
            </td>


            <td>
              ${Number(tx.quantity || 0).toLocaleString()}
            </td>


            <td>
              ${formatPeso(tx.buyPrice || 0)}
            </td>


            <td>
              ${formatPeso(tx.totalAmount || 0)}
            </td>


            <td>

              <button
  type="button"
  class="delete-btn"
  onclick="deleteTransaction('${tx.id}', 'Commodities')">

   Delete

</button>

            </td>

          </tr>

        `;

      });


      table.innerHTML = html;


    })


    .catch(function(error){

      console.error(
        "Commodity Transaction Error:",
        error
      );

    });

}





/* =========================
   STOCKS
========================= */


function loadStocks(){

  loadStockSummary();

  loadStockTransactions();


  callAppsScript(
    "getStocks",
    []
  )

  .then(function(data){


    const container =
      document.getElementById("stockCards");


    if(!container) return;


    container.innerHTML = "";


    if(!data || data.length === 0){

      container.innerHTML = `

        <div class="asset-card">

          <h3>
            No stocks yet
          </h3>

        </div>

      `;

      return;

    }


    let html = "";


    data.forEach(function(asset){

      html += `

        <div class="asset-card">

          <h2>
            ${asset.assetName}
          </h2>

          <p>
            Shares:
            ${Number(asset.quantity).toLocaleString()}
          </p>

          <p>
            Average Price:
            ${formatPeso(asset.averagePrice)}
          </p>

          <p>
            Current Price:
            ${formatPeso(asset.currentPrice)}
          </p>

          <p>
            Current Value:
            ${formatPeso(asset.currentValue)}
          </p>

          <p class="${asset.pnl >= 0 ? "positive" : "negative"}">

            P&L:
            ${asset.pnl >= 0 ? "+" : ""}
            ${formatPeso(asset.pnl)}

          </p>

        </div>

      `;

    });


    container.innerHTML = html;


  })

  .catch(function(error){

    console.error(
      "Stock Error:",
      error
    );

  });



}




function loadStockSummary(){

  callAppsScript(
    "getStocks",
    []
  )

  .then(function(data){


    let invested = 0;
    let current = 0;
    let pnl = 0;



    (data || []).forEach(function(asset){


      invested += Number(
        asset.invested || 0
      );


      current += Number(
        asset.currentValue || 0
      );


      pnl += Number(
        asset.pnl || 0
      );


    });



    const investedEl =
      document.getElementById(
        "stockTotalInvested"
      );


    if(investedEl){

      investedEl.innerHTML =
        formatPeso(invested);

    }



    const currentEl =
      document.getElementById(
        "stockCurrentValue"
      );


    if(currentEl){

      currentEl.innerHTML =
        formatPeso(current);

    }



    const pnlEl =
      document.getElementById(
        "stockTotalPnl"
      );


    if(pnlEl){

      pnlEl.innerHTML =
        (pnl >= 0 ? "+" : "") +
        formatPeso(pnl);


      pnlEl.className =
        pnl >= 0
        ? "positive"
        : "negative";

    }



    const assetsEl =
      document.getElementById(
        "stockTotalAssets"
      );


    if(assetsEl){

      assetsEl.innerHTML =
        (data || []).length;

    }



  })


  .catch(function(error){

    console.error(
      "Stock Summary Error:",
      error
    );

  });


}

function loadStockTransactions(){

  callAppsScript(
    "getStockTransactions",
    []
  )

    .then(function(data){

      const table =
        document.getElementById(
          "stockTransactionTable"
        );


      if(!table) return;


      table.innerHTML = "";


      if(!data || data.length === 0){

        table.innerHTML = `

          <tr>

            <td colspan="6">
              No transactions found
            </td>

          </tr>

        `;

        return;

      }


      let html = "";


      data.forEach(function(tx){

        html += `

          <tr>

            <td>
              ${tx.date}
            </td>


            <td>
              ${tx.transactionType}
            </td>


            <td>
              ${tx.assetName}
            </td>


            <td>
              ${Number(tx.quantity).toLocaleString()}
            </td>


            <td>
              ${formatPeso(tx.buyPrice)}
            </td>


            <td>
              ${formatPeso(tx.totalAmount)}
            </td>


            <td>

              <button
                class="delete-btn"
                onclick="deleteTransaction('${tx.id}', 'Stocks')">
                 Delete
              </button>

            </td>


          </tr>

        `;

      });


      table.innerHTML = html;


    })


    .withFailureHandler(function(error){

      console.error(
        "Stock Transaction Error:",
        error
      );

    })


    .getStockTransactions();

}





/* =========================
   TRANSACTION MODAL
========================= */

function showTransactionLoading(){

  const modal =
    document.getElementById("transactionModal");

  const icon =
    document.getElementById("transactionIcon");

  const message =
    document.getElementById("transactionMessage");


  /*
   * REMOVE DELETE / CANCEL BUTTONS
   *
   * This is important because the same
   * transactionModal is also used for
   * delete confirmations.
   */

  const actions =
    modal.querySelector(".transaction-actions");

  if(actions){

    actions.remove();

  }


  /*
   * RESET TO NORMAL SAVING STATE
   */

  if(icon){

    icon.innerHTML = "⏳";

  }


  if(message){

    message.innerHTML =
      "Saving transaction...";

  }


  modal.style.display =
    "flex";

}

/* =========================
   TRANSACTION SUCCESS
========================= */

function showTransactionSuccess(text){

  const modal =
    document.getElementById("transactionModal");

  const icon =
    document.getElementById("transactionIcon");

  const message =
    document.getElementById("transactionMessage");


  /*
   * REMOVE ANY DELETE BUTTONS
   */

  const actions =
    modal.querySelector(".transaction-actions");

  if(actions){

    actions.remove();

  }


  if(icon){

  icon.innerHTML = `

    <img
      src="https://i.imgur.com/ezCNVcz.png"
      alt="Success"
      class="transaction-success-icon"
    >

  `;

}


  if(message){

    message.innerHTML =
      text || "Transaction successful.";

  }


  modal.style.display =
    "flex";


  setTimeout(function(){

    modal.style.display =
      "none";

  },1500);

}

/* =========================
   TRANSACTION ERROR
========================= */

function showTransactionError(message){

  const modal =
    document.getElementById("transactionModal");

  const icon =
    document.getElementById("transactionIcon");

  const messageElement =
    document.getElementById("transactionMessage");


  /*
   * REMOVE ANY DELETE BUTTONS
   */

  const actions =
    modal.querySelector(".transaction-actions");

  if(actions){

    actions.remove();

  }


  if(icon){

    icon.innerHTML =
      "❌";

  }


  if(messageElement){

    messageElement.innerHTML =
      message;

  }


  modal.style.display =
    "flex";


  setTimeout(function(){

    modal.style.display =
      "none";

  },2000);

}




function showTransactionModal(message){

  let modal = document.getElementById("transactionNotification");

  if(!modal){

    modal = document.createElement("div");

    modal.id = "transactionNotification";

    modal.innerHTML = `
      <div class="transaction-card">

        <div id="transactionIcon">
          ⏳
        </div>

        <div id="transactionMessage">
          ${message}
        </div>

      </div>
    `;

    document.body.appendChild(modal);

  }
  else{

    document.getElementById("transactionMessage").innerHTML = message;

  }


  modal.style.display = "flex";


}



function hideTransactionModal(){

  const modal =
    document.getElementById("transactionNotification");


  if(modal){

    modal.style.display = "none";

  }

}


function showConfirmClaim(message, callback){


  const modal =
    document.getElementById("transactionNotification");


  if(!modal){

    console.error(
      "transactionNotification modal missing"
    );

    return;

  }



  document.getElementById("transactionIcon")
  .innerHTML = "⚠️";


  document.getElementById("transactionMessage")
  .innerHTML = `

    <p>${message}</p>

    <div style="margin-top:15px;">

      <button onclick="confirmClaimAction()">
        Yes, Claim
      </button>


      <button onclick="hideTransactionModal()">
        Cancel
      </button>

    </div>

  `;



  window.claimCallback = callback;


  modal.style.display = "flex";


}



function confirmClaimAction(){

  hideTransactionModal();


  if(window.claimCallback){

    window.claimCallback();

  }

}



function loginUser(){

  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim()
      .toLowerCase();


  if(!email){

    document
      .getElementById("loginMessage")
      .innerHTML =
      "Please enter your email.";

    return;

  }


  callAppsScript(
    "loginUser",
    [email]
  )

  .then(function(result){

    if(result.success){

      window.loggedInUser = {
        email: email
      };


      document
        .getElementById("loginScreen")
        .style.display = "none";


      document
        .getElementById("mainApp")
        .style.display = "flex";


      loadDashboard();

    }
    else{

      document
        .getElementById("loginMessage")
        .innerHTML =
        result.message || "Access denied.";

    }

  })

  .catch(function(error){

    console.error("Login Error:", error);

    const message =
      error && error.message
        ? error.message
        : "Unable to login. Please try again.";

    document
      .getElementById("loginMessage")
      .innerHTML =
      message;

  });

}


function openPersonalIncomeModal(){

  const modal =
    document.getElementById("personalIncomeModal");

  if(!modal){

    console.error(
      "personalIncomeModal not found"
    );

    return;

  }

  const date =
    document.getElementById("personalIncomeDate");

  if(date){

    date.value =
      new Date().toISOString().split("T")[0];

  }

  modal.style.display = "flex";

}


function closePersonalIncomeModal(){

  const modal =
    document.getElementById("personalIncomeModal");

  if(modal){

    modal.style.display = "none";

  }

}




/* =========================
   SUBMIT PERSONAL INCOME
========================= */

function submitPersonalIncome(){

  const data = {

    date:
      document.getElementById(
        "personalIncomeDate"
      ).value,

    source:
      document.getElementById(
        "personalIncomeSource"
      ).value,

    description:
      document.getElementById(
        "personalIncomeDescription"
      ).value.trim(),

    amount:
      Number(
        document.getElementById(
          "personalIncomeAmount"
        ).value
      )

  };


  console.log(
    "PERSONAL INCOME DATA:",
    data
  );


  if(
    !data.date ||
    !data.source ||
    data.amount <= 0 ||
    isNaN(data.amount)
  ){

    alert(
      "Please complete the personal income details."
    );

    return;

  }


  // SHOW LOADING MODAL

  showTransactionLoading();


  callAppsScript("savePersonalIncome", [data])

    .then(function(response){

      console.log(
        "Personal Income Response:",
        response
      );


      if(
        !response ||
        !response.success
      ){

        showTransactionError(
          response?.message ||
          "Unable to save personal income."
        );

        return;

      }


      // SUCCESS

      showTransactionSuccess();


      closePersonalIncomeModal();


      // Refresh the page

      loadPersonalIncome();


      loadDashboard();


    })


    .catch(function(error){

      console.error(
        "Personal Income Error:",
        error
      );


      showTransactionError(
        "Failed saving personal income."
      );

    });

}








/* =========================
   LOAD BUSINESS INCOME
========================= */



/* =========================
   LOAD BUSINESS INCOME
========================= */

function loadBusinessIncome(){

  callAppsScript(
    "getBusinessIncome",
    []
  )

    .then(function(data){

      console.log(
        "Business Income Data:",
        data
      );


      data = data || [];


      /*
       * =========================
       * LOAD BUSINESS CARDS
       * =========================
       */

      const cards =
        document.getElementById(
          "businessIncomeCards"
        );


      if(cards){

        cards.innerHTML = "";


        if(data.length === 0){

          cards.innerHTML = `

            <div class="asset-card">

              <h3>
                No businesses yet
              </h3>

            </div>

          `;

        }
        else{

          /*
           * GROUP BY BUSINESS
           */

          const businesses = {};


          data.forEach(function(income){

            const business =
              String(
                income.business || "Other"
              ).trim();


            if(!businesses[business]){

              businesses[business] = 0;

            }


            businesses[business] +=
              Number(income.amount) || 0;

          });


          /*
           * CREATE BUSINESS CARDS
           */

          Object.keys(businesses).forEach(
            function(business){

              cards.innerHTML += `

                <div class="asset-card">

                  <h2>
                    ${business}
                  </h2>

                  <p>
                    Total Income:
                    ${formatPeso(
                      businesses[business]
                    )}
                  </p>

                </div>

              `;

            }
          );

        }

      }


      /*
       * =========================
       * LOAD INCOME HISTORY
       * =========================
       */

      const table =
        document.getElementById(
          "businessIncomeTransactionTable"
        );


      if(!table){

        console.error(
          "businessIncomeTransactionTable not found"
        );

        return;

      }


      table.innerHTML = "";


      if(data.length === 0){

        table.innerHTML = `

          <tr>

            <td colspan="5">
              No business income recorded yet.
            </td>

          </tr>

        `;

        return;

      }


      /*
       * CREATE HISTORY ROWS
       */

      data.forEach(function(income){

        table.innerHTML += `

          <tr>

            <td>
              ${income.date || ""}
            </td>


            <td>
              ${income.business || ""}
            </td>


            <td>
              ${income.description || ""}
            </td>


            <td>
              ${formatPeso(
                Number(income.amount) || 0
              )}
            </td>


            <td>

              <button
                type="button"
                class="delete-btn"
                onclick="deleteTransaction('${income.id}', 'Business Income')">

                Delete

              </button>

            </td>

          </tr>

        `;

      });

    })


    .catch(function(error){

      console.error(
        "Business Income Loading Error:",
        error
      );

    });


  /*
   * =========================
   * LOAD BUSINESS INCOME SUMMARY
   * =========================
   */

  callAppsScript(
    "getBusinessIncomeSummary",
    []
  )

    .then(function(summary){

      console.log(
        "Business Income Summary:",
        summary
      );


      if(!summary) return;


      /*
       * THIS MONTH
       */

      const monthly =
        document.getElementById(
          "businessIncomeMonthly"
        );


      if(monthly){

        monthly.textContent =
          formatPeso(
            Number(summary.monthly) || 0
          );

      }


      /*
       * THIS YEAR
       */

      const yearly =
        document.getElementById(
          "businessIncomeYearly"
        );


      if(yearly){

        yearly.textContent =
          formatPeso(
            Number(summary.yearly) || 0
          );

      }


      /*
       * AVERAGE MONTHLY INCOME
       */

      const average =
        document.getElementById(
          "businessIncomeAverage"
        );


      if(average){

        average.textContent =
          formatPeso(
            Number(summary.average) || 0
          );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Business Income Summary Error:",
        error
      );

    })


    .catch(function(error){

      console.error(
        "Business Income Summary Error:",
        error
      );

    });

}



/* =========================
   BUSINESS INCOME MODAL
========================= */

function openBusinessIncomeModal(){

  const modal =
    document.getElementById(
      "businessIncomeModal"
    );


  if(!modal){

    console.error(
      "businessIncomeModal not found"
    );

    return;

  }


  /*
   * Set today's date
   */

  const dateInput =
    document.getElementById(
      "businessIncomeDate"
    );


  if(dateInput){

    const today =
      new Date();


    const year =
      today.getFullYear();


    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");


    const day =
      String(
        today.getDate()
      ).padStart(2, "0");


    dateInput.value =
      year + "-" +
      month + "-" +
      day;

  }


  modal.style.display = "flex";

}



function closeBusinessIncomeModal(){

  const modal =
    document.getElementById(
      "businessIncomeModal"
    );


  if(modal){

    modal.style.display = "none";

  }

}



/* =========================
   SUBMIT BUSINESS INCOME
========================= */

/* =========================
   SUBMIT BUSINESS INCOME
========================= */

function submitBusinessIncome(){

  const date =
    document.getElementById(
      "businessIncomeDate"
    ).value;


  const business =
    document.getElementById(
      "businessIncomeBusiness"
    ).value.trim();


  const description =
    document.getElementById(
      "businessIncomeDescription"
    ).value.trim();


  const amount =
    Number(
      document.getElementById(
        "businessIncomeAmount"
      ).value
    );


  /*
   * VALIDATION
   */

  if(
    !date ||
    !business ||
    amount <= 0
  ){

    alert(
      "Please complete the date, business, and amount."
    );

    return;

  }


  /*
   * SHOW SAVING MESSAGE
   */

  showTransactionLoading(
    "Saving business income..."
  );


  /*
   * SAVE TO GOOGLE SHEETS
   */

  callAppsScript(
    "saveBusinessIncome",
    [data]
  )

    .then(function(result){

      if(
        result &&
        result.success
      ){

        /*
         * Show success
         */

        showTransactionSuccess(
          "Business income saved successfully."
        );


        /*
         * Close Business Income modal
         */

        closeBusinessIncomeModal();


        /*
         * Clear form
         */

        document.getElementById(
          "businessIncomeBusiness"
        ).value = "";


        document.getElementById(
          "businessIncomeDescription"
        ).value = "";


        document.getElementById(
          "businessIncomeAmount"
        ).value = "";


        /*
         * Reload history
         */

        loadBusinessIncome();


      }
      else{

        showTransactionError(
          result &&
          result.message
            ? result.message
            : "Unable to save business income."
        );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Business Income Save Error:",
        error
      );


      showTransactionError(
        "Unable to save business income."
      );

    })


    callAppsScript(
  "saveBusinessIncome",
  [{
    date: date,
    business: business,
    description: description,
    amount: amount
  }]
)

.catch(function(error){

  console.error(
    "Unable to save business income.",
    error
  );

  showTransactionError(
    "Unable to save business income."
  );

});

}




/* =========================
   LOAD BUSINESS INCOME SUMMARY
========================= */

function loadBusinessIncomeSummary(){

  callAppsScript(
    "getBusinessIncomeSummary",
    []
  )

    .then(function(data){

      console.log(
        "Business Income Summary:",
        data
      );


      /*
       * THIS MONTH
       */

      const monthly =
        document.getElementById(
          "businessIncomeMonthly"
        );


      if(monthly){

        monthly.textContent =
          formatPeso(
            Number(data.monthly) || 0
          );

      }


      /*
       * THIS YEAR
       */

      const yearly =
        document.getElementById(
          "businessIncomeYearly"
        );


      if(yearly){

        yearly.textContent =
          formatPeso(
            Number(data.yearly) || 0
          );

      }


      /*
       * AVERAGE MONTHLY
       */

      const average =
        document.getElementById(
          "businessIncomeAverage"
        );


      if(average){

        average.textContent =
          formatPeso(
            Number(data.average) || 0
          );

      }

    })


    .catch(function(error){

      console.error(
        "Business Income Summary Error:",
        error
      );

    });

}



/* =========================
   LOAD CREDIT CARDS
========================= */

function loadCreditCards(){

  callAppsScript(
    "getCreditCards",
    []
  )

    .then(function(data){

      console.log(
        "Credit Cards Data:",
        data
      );


      const cards =
        document.getElementById(
          "creditCardCards"
        );


      if(!cards){

        console.error(
          "creditCardCards not found"
        );

        return;

      }


      cards.innerHTML = "";


      if(!data || data.length === 0){

        cards.innerHTML = `

          <div class="summary-card">

            <h3>
  <img 
    src="https://i.imgur.com/XcrtkyC.png"
    alt="Loan"
    class="loan-icon"
  >
  ${loan.loanName}
</h3>

            <p>
              Add a credit card to get started.
            </p>

          </div>

        `;

        return;

      }


      data.forEach(function(card){

        const available =
          Number(card.creditLimit) -
          Number(card.balance);


        const utilization =
          Number(card.creditLimit) > 0
            ? (
                Number(card.balance) /
                Number(card.creditLimit)
              ) * 100
            : 0;


        cards.innerHTML += `

  <div class="summary-card credit-card-item">

    <h3>
  <img 
    src="https://i.imgur.com/L9jfdLG.png"
    alt="Credit Card"
    class="credit-card-icon"
  >
  ${card.cardName}
</h3>

    <p>
  <strong>Balance:</strong>
  ${formatPeso(
    Number(card.balance) || 0
  )}
</p>

<p>
  <strong>Credit Limit:</strong>
  ${formatPeso(
    Number(card.creditLimit) || 0
  )}
</p>

<p>
  <strong>Available:</strong>
  ${formatPeso(
    available
  )}
</p>

<p>
  <strong>Utilization:</strong>
  ${utilization.toFixed(1)}%
</p>

<br>

<div class="card-actions">

  <button
  type="button"
  class="edit-btn"
  style="
    display:inline-flex !important;
    width:auto !important;
    min-width:100px !important;
    height:38px !important;
    padding:8px 14px !important;
    align-items:center !important;
    justify-content:center !important;
    gap:6px !important;
    font-size:14px !important;
    line-height:normal !important;
    visibility:visible !important;
    opacity:1 !important;
  "
  onclick="editCreditCard('${card.id}')"
>
  Edit
</button>


  <button
    type="button"
    class="delete-btn"
    onclick="console.log('CREDIT CARD DELETE CLICKED:', '${card.id}'); deleteCreditCard('${card.id}')"
  >
    Delete
  </button>

</div>


</div>

`;

      });


      /*
       * UPDATE SUMMARY
       */

      let totalBalance = 0;
      let totalLimit = 0;


      data.forEach(function(card){

        totalBalance +=
          Number(card.balance) || 0;

        totalLimit +=
          Number(card.creditLimit) || 0;

      });


      const availableCredit =
        totalLimit -
        totalBalance;


      const utilization =
        totalLimit > 0
          ? (
              totalBalance /
              totalLimit
            ) * 100
          : 0;


      const balanceElement =
        document.getElementById(
          "creditCardTotalBalance"
        );


      const limitElement =
        document.getElementById(
          "creditCardTotalLimit"
        );


      const availableElement =
        document.getElementById(
          "creditCardAvailableCredit"
        );


      const utilizationElement =
        document.getElementById(
          "creditCardUtilization"
        );


      if(balanceElement){

        balanceElement.textContent =
          formatPeso(totalBalance);

      }


      if(limitElement){

        limitElement.textContent =
          formatPeso(totalLimit);

      }


      if(availableElement){

        availableElement.textContent =
          formatPeso(availableCredit);

      }


      if(utilizationElement){

        utilizationElement.textContent =
          utilization.toFixed(1) + "%";

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Credit Cards Loading Error:",
        error
      );

    })


    .getCreditCards();

}




/* =========================
   CREDIT CARD MODAL
========================= */

function openCreditCardModal(){


window.editingCreditCardId = "";


  const modal =
    document.getElementById(
      "creditCardModal"
    );


  if(!modal){

    console.error(
      "creditCardModal not found"
    );

    return;

  }


  modal.style.display = "flex";

}



function closeCreditCardModal(){

  const modal =
    document.getElementById(
      "creditCardModal"
    );


  if(modal){

    modal.style.display = "none";

  }

}


/* =========================
   SUBMIT CREDIT CARD
========================= */

function submitCreditCard(){


  const data = {

    id:
      window.editingCreditCardId || "",


    cardName:
      document.getElementById(
        "creditCardName"
      ).value.trim(),


    creditLimit:
      Number(
        document.getElementById(
          "creditCardLimit"
        ).value
      ) || 0,


    balance:
      Number(
        document.getElementById(
          "creditCardBalance"
        ).value
      ) || 0

  };



  // =========================
  // UPDATE EXISTING CARD
  // =========================

  if(data.id){


    callAppsScript(
      "updateCreditCard",
      [data]
    )

      .then(function(response){


        if(response.success){

  showTransactionSuccess(
    "Credit card updated successfully."
  );


  closeCreditCardModal();


  window.editingCreditCardId = "";


  loadCreditCards();

}

        
        else{

          alert(
            response.message
          );

        }


      })

      .catch(function(error){

        console.error(
          "Update credit card error:",
          error
        );

      });


    return;

  }



  // =========================
  // CREATE NEW CARD
  // =========================


  callAppsScript(
    "saveCreditCard",
    [data]
  )

    .then(function(response){


      if(response.success){


        showTransactionSuccess(
  "Credit card saved successfully."
);


        closeCreditCardModal();


        loadCreditCards();


      }
      else{

        alert(
          response.message
        );

      }


    })

    .catch(function(error){

      console.error(
        "Save credit card error:",
        error
      );

    });


}





/* =========================
   LOAD LOANS
========================= */

function loadLoans(){

  console.log("🔥 LOAD LOANS FIRED");


  callAppsScript(
    "getLoans",
    []
  )

    .then(function(data){

      console.log(
        "Loans Data:",
        data
      );


      setTimeout(function(){


        const cards =
          document.getElementById(
            "loanCards"
          );


        console.log(
          "🔥 LOAN CARDS ELEMENT:",
          cards
        );


        if(!cards){

          console.error(
            "❌ loanCards not found."
          );

          return;

        }


        cards.innerHTML = "";



        /*
         * NO LOANS
         */

        if(!data || data.length === 0){


          cards.innerHTML = `

            <div class="summary-card">

              <h3>

                <img
                  src="https://i.imgur.com/XcrtkyC.png"
                  alt="Loan"
                  class="loan-icon"
                >

                No Loans

              </h3>


              <p>
                Add a loan to get started.
              </p>

            </div>

          `;

        }



        let totalOutstanding = 0;

        let totalOriginal = 0;

        let totalPaid = 0;

        let activeCount = 0;




        /*
         * RENDER LOANS
         */

        if(data && data.length > 0){


          data.forEach(function(loan){


            const original =
              Number(
                loan.originalAmount
              ) || 0;


            const outstanding =
              Number(
                loan.outstandingBalance
              ) || 0;


            const paid =
              original - outstanding;



            totalOriginal += original;

            totalOutstanding += outstanding;

            totalPaid += paid;



            if(outstanding > 0){

              activeCount++;

            }


              cards.innerHTML += `

  <div class="summary-card loan-card-item">


    <h3>

      <img
        src="https://i.imgur.com/XcrtkyC.png"
        alt="Loan"
        class="loan-icon"
      >

      ${loan.loanName}

    </h3>



    <p>
      <strong>Outstanding:</strong>
      ${formatPeso(outstanding)}
    </p>



    <p>
      <strong>Original Loan:</strong>
      ${formatPeso(original)}
    </p>



    <p>
      <strong>Paid:</strong>
      ${formatPeso(paid)}
    </p>



    <p>
      <strong>Status:</strong>
      ${loan.status || "ACTIVE"}
    </p>


<br>

    <div class="card-actions">


      <button
        type="button"
        class="edit-btn"
        onclick="editLoan('${loan.id}')"
      >
        Edit
      </button>



      <button
        type="button"
        class="delete-btn"
        onclick="deleteLoan('${loan.id}')"
      >
        Delete
      </button>


    </div>



  </div>


`;

          });


        }





        /*
         * UPDATE SUMMARY
         */

        const outstandingElement =
          document.getElementById(
            "loanTotalOutstanding"
          );


        const originalElement =
          document.getElementById(
            "loanTotalOriginal"
          );


        const paidElement =
          document.getElementById(
            "loanTotalPaid"
          );


        const activeElement =
          document.getElementById(
            "loanActiveCount"
          );



        if(outstandingElement){

          outstandingElement.textContent =
            formatPeso(
              totalOutstanding
            );

        }



        if(originalElement){

          originalElement.textContent =
            formatPeso(
              totalOriginal
            );

        }



        if(paidElement){

          paidElement.textContent =
            formatPeso(
              totalPaid
            );

        }



        if(activeElement){

          activeElement.textContent =
            activeCount;

        }



        console.log(
          "✅ Loans rendered successfully."
        );



      },100);



    })



    .withFailureHandler(function(error){


      console.error(
        "❌ Loans Loading Error:",
        error
      );


    })



    .getLoans();


}




/* =========================
   LOAN MODAL
========================= */

function openLoanModal(){


  window.editingLoanId = "";


  const title =
    document.querySelector(
      "#loanModal h2"
    );


  if(title){

    title.textContent =
      "Add Loan";

  }



  const modal =
    document.getElementById(
      "loanModal"
    );


  if(!modal){

    console.error(
      "loanModal not found"
    );

    return;

  }


  modal.style.display =
    "flex";


}


/* =========================
   CLOSE LOAN MODAL
========================= */

function closeLoanModal(){

  const modal =
    document.getElementById(
      "loanModal"
    );


  if(modal){

    modal.style.display =
      "none";

  }

}



/* =========================
   SUBMIT LOAN
========================= */

function submitLoan(){

  const id =
  window.editingLoanId || "";

  const loanName =
    document.getElementById(
      "loanName"
    ).value.trim();


  const loanType =
    document.getElementById(
      "loanType"
    ).value;


  const loanDate =
    document.getElementById(
      "loanDate"
    ).value;


  const originalAmount =
    Number(
      document.getElementById(
        "loanOriginalAmount"
      ).value
    );


  const outstandingBalance =
    Number(
      document.getElementById(
        "loanOutstandingBalance"
      ).value
    );


  /*
   * VALIDATION
   */

  if(!loanName){

    alert(
      "Please enter the loan name."
    );

    return;

  }


  if(!loanType){

    alert(
      "Please select a loan type."
    );

    return;

  }


  if(!loanDate){

    alert(
      "Please select the loan date."
    );

    return;

  }


  if(originalAmount <= 0){

    alert(
      "Please enter a valid original loan amount."
    );

    return;

  }


  if(outstandingBalance < 0){

    alert(
      "Outstanding balance cannot be negative."
    );

    return;

  }


  if(
    outstandingBalance >
    originalAmount
  ){

    alert(
      "Outstanding balance cannot be greater than the original loan amount."
    );

    return;

  }


  /*
   * SAVING
   */

  showTransactionLoading(
    "Saving loan..."
  );


  callAppsScript(
    "saveLoan",
    [data]
  )

    .then(function(result){

      if(
        result &&
        result.success
      ){

        showTransactionSuccess(
          "Loan saved successfully."
        );


        closeLoanModal();


        /*
         * CLEAR FORM
         */

        document.getElementById(
          "loanName"
        ).value = "";


        document.getElementById(
          "loanType"
        ).value = "";


        document.getElementById(
          "loanDate"
        ).value = "";


        document.getElementById(
          "loanOriginalAmount"
        ).value = "";


        document.getElementById(
          "loanOutstandingBalance"
        ).value = "";


        /*
         * RELOAD LOANS
         */

        loadLoans();

      }
      else{

        showTransactionError(
          result &&
          result.message
            ? result.message
            : "Unable to save loan."
        );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Loan Save Error:",
        error
      );


      showTransactionError(
        "Unable to save loan."
      );

    })


    if(id){


  callAppsScript(
    "updateLoan",
    [data]
  )

    .then(function(result){

      if(result && result.success){

        showTransactionSuccess(
          "Loan updated successfully."
        );


        closeLoanModal();


        window.editingLoanId = "";


        loadLoans();

      }
      else{

        showTransactionError(
          result.message
        );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Loan Update Error:",
        error
      );


      showTransactionError(
        "Unable to update loan."
      );

    })


     .catch(function(error){

      console.error(
        "Unable to update loan.",
        error
      );

      showTransactionError(
        "Unable to update loan."
      );

    });


}
else{


  callAppsScript(
    "saveLoan",
    [data]
  )

    .then(function(result){

      if(result && result.success){

        showTransactionSuccess(
          "Loan saved successfully."
        );


        closeLoanModal();


        loadLoans();

      }
      else{

        showTransactionError(
          result.message
        );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Loan Save Error:",
        error
      );


      showTransactionError(
        "Unable to save loan."
      );

    })


    .saveLoan({

      loanName:
        loanName,

      loanType:
        loanType,

      date:
        loanDate,

      originalAmount:
        originalAmount,

      outstandingBalance:
        outstandingBalance

    });

}

}



/* =========================
   SUBMIT EXPENSE
========================= */

function submitExpense(){

  const expenseName =
    document.getElementById(
      "expenseName"
    ).value.trim();


  const expenseCategory =
    document.getElementById(
      "expenseCategory"
    ).value;


  const expenseDate =
    document.getElementById(
      "expenseDate"
    ).value;


  const expenseAmount =
    Number(
      document.getElementById(
        "expenseAmount"
      ).value
    );


  const expenseDescription =
    document.getElementById(
      "expenseDescription"
    ).value.trim();


  /*
   * VALIDATION
   */

  if(!expenseName){

    alert(
      "Please enter the expense name."
    );

    return;

  }


  if(!expenseCategory){

    alert(
      "Please select an expense category."
    );

    return;

  }


  if(!expenseDate){

    alert(
      "Please select the expense date."
    );

    return;

  }


  if(expenseAmount <= 0){

    alert(
      "Please enter a valid expense amount."
    );

    return;

  }


  /*
   * SHOW SAVING
   */

  showTransactionLoading(
    "Saving expense..."
  );


  /*
   * SAVE TO GOOGLE SHEETS
   */

  callAppsScript(
    "saveExpense",
    [data]
  )

    .then(function(result){

      if(
        result &&
        result.success
      ){

        showTransactionSuccess(
          "Expense saved successfully."
        );


        /*
         * CLOSE MODAL
         */

        closeExpenseModal();


        /*
         * CLEAR FORM
         */

        document.getElementById(
          "expenseName"
        ).value = "";


        document.getElementById(
          "expenseCategory"
        ).value = "";


        document.getElementById(
          "expenseDate"
        ).value = "";


        document.getElementById(
          "expenseAmount"
        ).value = "";


        document.getElementById(
          "expenseDescription"
        ).value = "";


        /*
         * RELOAD EXPENSES
         */

        loadExpenses();

      }
      else{

        showTransactionError(
          result &&
          result.message
            ? result.message
            : "Unable to save expense."
        );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "Expense Save Error:",
        error
      );


      showTransactionError(
        "Unable to save expense."
      );

    })


    .saveExpense({

      expenseName:
        expenseName,

      category:
        expenseCategory,

      date:
        expenseDate,

      amount:
        expenseAmount,

      description:
        expenseDescription

    });

}



/* =========================
   DELETE LOAN DIRECTLY
========================= */

function deleteLoan(id){

  console.log(
    "DELETE LOAN CLICKED:",
    id
  );


  if(!id){

    alert(
      "Loan ID is missing."
    );

    return;

  }


  google.script.run

    .withSuccessHandler(function(response){

      console.log(
        "DELETE LOAN RESPONSE:",
        response
      );


      if(
        response &&
        response.success
      ){

       showTransactionSuccess(
  "Loan successfully deleted."
);


        loadLoans();

        loadDashboard();

      }
      else{

       showTransactionError(
  response.message ||
  "Unable to delete loan."
);

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "DELETE LOAN FAILED:",
        error
      );


      showTransactionError(
  "Unable to delete loan."
);

    })


    .deleteLoan(id);

}





/* =========================
   DELETE CREDIT CARD DIRECTLY
========================= */

function deleteCreditCard(id){

  console.log(
    "DELETE CREDIT CARD CLICKED:",
    id
  );


  if(!id){

    alert(
      "Credit card ID is missing."
    );

    return;

  }


  google.script.run

    .withSuccessHandler(function(response){

      console.log(
        "DELETE CREDIT CARD RESPONSE:",
        response
      );


      if(
        response &&
        response.success
      ){

        showTransactionSuccess(
  "Credit card successfully deleted."
);


        loadCreditCards();


        loadDashboard();

      }
      else{

        showTransactionError(
  response.message ||
  "Unable to delete credit card."
);

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "DELETE CREDIT CARD FAILED:",
        error
      );


      showTransactionError(
  "Unable to delete credit card."
);

    })


    .deleteCreditCard(id);

}






function performCreditCardDelete(id){

  console.log(
    "🔥 PERFORM CREDIT CARD DELETE FIRED:",
    id
  );


  google.script.run

    .withSuccessHandler(function(response){

      console.log(
        "DELETE CREDIT CARD RESPONSE:",
        response
      );


      if(
        response &&
        response.success
      ){

        alert(
          "Credit card successfully deleted."
        );


        loadCreditCards();

        loadDashboard();

      }
      else{

        alert(
          response.message ||
          "Unable to delete credit card."
        );

      }

    })


    .withFailureHandler(function(error){

      console.error(
        "DELETE CREDIT CARD FAILED:",
        error
      );


      alert(
        "Unable to delete credit card."
      );

    })


    .deleteCreditCard(id);

}



function goBackDashboard(){

  goBack();

}








/* =========================
   EDIT CREDIT CARD
========================= */

function editCreditCard(id){


  google.script.run

    .withSuccessHandler(function(cards){


      const card =
        cards.find(function(item){

          return item.id === id;

        });



      if(!card){

        alert("Credit card not found.");

        return;

      }



      // Store ID being edited

      window.editingCreditCardId =
        card.id;



      // Fill modal fields

      document.getElementById(
        "creditCardName"
      ).value =
        card.cardName;



      document.getElementById(
        "creditCardLimit"
      ).value =
        card.creditLimit;



      document.getElementById(
        "creditCardBalance"
      ).value =
        card.balance;



      // Change modal title

      document.querySelector(
        "#creditCardModal h2"
      ).textContent =
        "Edit Credit Card";



      // Open modal

      document.getElementById(
        "creditCardModal"
      ).style.display =
        "flex";


    })


    .getCreditCards();


}



