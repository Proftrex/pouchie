/* global SpreadsheetApp, Utilities, Session */
/* eslint-disable no-unused-vars */



const APPS_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbz7SOxgW0fnxVB9d7jYn57RAYjOdmTOmVRir7WgMONDRkGfz450VMgi9JRSnWfQa3Df9Q/exec";


function callAppsScript(action,args=[]){

  const startTime = performance.now();

  console.log("SENDING ACTION:", action);

  return fetch(
    APPS_SCRIPT_URL,
    {
      method:"POST",

      redirect:"follow",

      body:JSON.stringify({

        action: action,

        data:{
          args: args
        }

      })

    }
  )
  .then(function(response){

    return response.text();

  })
  .then(function(text){

    console.log("RAW RESPONSE:", text);

    console.log("APP SCRIPT TEXT RESPONSE:", text);



    try {

      let data = JSON.parse(text);


      // Normalize Apps Script responses
      if(data && typeof data === "object"){

        if(
          data.success === undefined &&
          data.status === "success"
        ){
          data.success = true;
        }


        if(
          data.status === undefined &&
          data.success === true
        ){
          data.status = "success";
        }

      }


      console.log(
        action + " completed in ",
        Math.round(performance.now() - startTime),
        "ms"
      );

      return data;

    }
    catch(e){

      console.error("JSON PARSE FAILED:", e);

      return {
        success:false,
        status:"error",
        message:text
      };

    }

  });

}




/* =========================
   DEVICE TYPE DETECTION
========================= */

function detectDevice() {

  var isMobile =
    window.screen.width <= 768 ||
    window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    document.body.classList.add("mobile-device");
  } else {
    document.body.classList.remove("mobile-device");
  }

}

window.addEventListener("load", function() {

  detectDevice();


  /*
   * RESTORE LOGIN SESSION
   */

  const savedSession =
    localStorage.getItem("pouchSession");


  if(savedSession){

    window.loggedInUser =
      JSON.parse(savedSession);


    const loginScreen =
      document.getElementById("loginScreen");


    const mainApp =
      document.getElementById("mainApp");


    if(loginScreen){

      loginScreen.style.display =
        "none";

    }


    if(mainApp){

      mainApp.style.display =
        "flex";

    }


    setTimeout(function(){

      loadDashboard();

    },100);

  }

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

  const stablecoins =
    document.getElementById("stablecoinsPage");

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

  if (stablecoins)
    stablecoins.style.display = "none";

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


    setTimeout(function(){

      const transactionModal =
        document.getElementById("transactionModal");


      if(transactionModal){

        transactionModal.style.display = "none";

      }

    },800);

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


  else if (page === "stablecoins") {

    if (stablecoins)
      stablecoins.style.display = "block";

    loadStablecoins();

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
    loadCreditCardPayments();

  }


  // =========================
  // LOANS
  // =========================

  else if (page === "loans") {

    if (loans)
      loans.style.display = "block";

    loadLoans();
    loadLoanPayments();

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

  closeTransactionModal();

  document.getElementById("savingsModal").style.display = "none";
}

function openBondModal(){
  document.getElementById("bondModal").style.display = "flex";
}

function closeBondModal(){
  closeTransactionModal();
  document.getElementById("bondModal").style.display = "none";
}

function openWithdrawalModal(){
  document.getElementById("withdrawalModal").style.display = "flex";
  loadAvailableWithdrawalBanks();
}

function closeWithdrawalModal(){
  closeTransactionModal();
  document.getElementById("withdrawalModal").style.display = "none";
}

/* =========================
   CRYPTO MODAL
========================= */

function loadCryptoDropdown(){

  callAppsScript(
    "getCryptoList",
    []
  )

  .then(function(response){

    console.log(
      "CRYPTO RESPONSE:",
      response
    );

    const coins =
      response.data || response;

    const dropdown =
      document.getElementById("cryptoName");

    if(!dropdown){
      console.error("cryptoName dropdown not found");
      return;
    }

    dropdown.innerHTML =
    `
    <option value="">
      Select Cryptocurrency
    </option>
    `;

    if(!Array.isArray(coins)){
      console.error("Crypto list is not an array:", coins);
      return;
    }

    coins.forEach(function(coin){
      dropdown.innerHTML +=
      `
      <option value="${coin.name} (${coin.symbol})">
        ${coin.name} (${coin.symbol})
      </option>
      `;
    });

  })

  .catch(function(error){
    console.error("Crypto dropdown error:", error);
  });
}

function openCryptoModal(){

  document.getElementById("cryptoModal").style.display = "flex";

  const transactionType =
    document.getElementById("cryptoTransactionType");

  if(transactionType){
    transactionType.value = "Buy";
  }

  loadCryptoDropdown();
}

function closeCryptoModal(){
  const modal = document.getElementById("cryptoModal");
  if(modal){
    modal.style.display = "none";
  }
}

function saveCryptoTransaction(){

  const date =
    document.getElementById("cryptoDate").value;

  const assetName =
    document.getElementById("cryptoName").value;

  const quantity =
    Number(document.getElementById("cryptoQuantity").value);

  const buyPrice =
    Number(document.getElementById("cryptoBuyPrice").value);

  const transactionType =
    document.getElementById("cryptoTransactionType").value;

  if(!date || !assetName || quantity <= 0 || buyPrice <= 0){
    showTransactionError("Please complete the cryptocurrency transaction details.");
    return;
  }

  google.script.run
    .withSuccessHandler(function(result){
      if(result && result.success){
        showTransactionSuccess(result.message || "Transaction saved successfully.");
        closeCryptoModal();
        loadCryptocurrenciesDashboard();
        loadTransactions();
      }else{
        showTransactionError(result?.message || "Unable to save transaction.");
      }
    })
    .withFailureHandler(function(error){
      console.error("Crypto Save Error:", error);
      showTransactionError("Unable to save transaction.");
    })
    .saveCrypto({
      date: date,
      assetName: assetName,
      quantity: quantity,
      buyPrice: buyPrice,
      transactionType: transactionType
    });
}

/* =========================
   CRYPTO SUMMARY
========================= */

function loadCryptoSummary(){

  google.script.run

  .withSuccessHandler(function(data){

    let invested = 0;
    let current = 0;
    let pnl = 0;

    (data || []).forEach(function(asset){
      invested += Number(asset.invested || 0);
      current += Number(asset.currentValue || 0);
      pnl += Number(asset.pnl || 0);
    });

    const investedEl =
      document.getElementById("cryptoTotalInvested");

    if(investedEl){
      investedEl.innerHTML = formatPeso(invested);
    }

    const currentEl =
      document.getElementById("cryptoCurrentValue");

    if(currentEl){
      currentEl.innerHTML = formatPeso(current);
    }

    const pnlEl =
      document.getElementById("cryptoTotalPnl");

    if(pnlEl){
      pnlEl.innerHTML =
        (pnl >= 0 ? "+" : "") + formatPeso(pnl);
      pnlEl.className = pnl >= 0 ? "positive" : "negative";
    }

    const assetsEl =
      document.getElementById("cryptoTotalAssets");

    if(assetsEl){
      assetsEl.innerHTML = (data || []).length;
    }

  })

  .withFailureHandler(function(error){
    console.error("Crypto Summary Error:", error);
  })

  .getCryptocurrencies();
}

/* =========================
   CRYPTO TRANSACTIONS
========================= */

function loadCryptoTransactions(){

  google.script.run
    .withSuccessHandler(function(data){
      renderCryptoTransactions(data || []);
    })
    .withFailureHandler(function(error){
      console.error("Crypto Transactions Error:", error);
    })
    .getCryptoTransactions();
}

function renderCryptoTransactions(data){

  const tbody =
    document.getElementById("cryptoTransactionsBody");

  if(!tbody) return;

  tbody.innerHTML = "";

  if(!data || data.length === 0){
    tbody.innerHTML = `
      <tr>
        <td colspan="6">No crypto transactions yet.</td>
      </tr>
    `;
    return;
  }

  data.forEach(function(tx){
    tbody.innerHTML += `
      <tr>
        <td>${tx.date || ""}</td>
        <td>${tx.transactionType || ""}</td>
        <td>${tx.assetName || ""}</td>
        <td>${Number(tx.quantity || 0).toLocaleString()}</td>
        <td>${formatPeso(tx.buyPrice)}</td>
        <td>
          <button
            class="delete-btn"
            onclick="deleteTransaction('${tx.id}', 'Crypto')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

function loadTransactions(){

  google.script.run
    .withSuccessHandler(function(data){
      renderTransactionTable(data || []);
    })
    .withFailureHandler(function(error){
      console.error("Transactions Error:", error);
    })
    .getTransactions();
}

function renderTransactionTable(data){

  const tbody =
    document.getElementById("transactionsBody");

  if(!tbody) return;

  tbody.innerHTML = "";

  if(!data || data.length === 0){
    tbody.innerHTML = `
      <tr>
        <td colspan="6">No transactions yet.</td>
      </tr>
    `;
    return;
  }

  data.forEach(function(tx){
    tbody.innerHTML += `
      <tr>
        <td>${tx.date || ""}</td>
        <td>${tx.transactionType || ""}</td>
        <td>${tx.assetName || ""}</td>
        <td>${Number(tx.quantity || 0).toLocaleString()}</td>
        <td>${formatPeso(tx.buyPrice)}</td>
        <td>
          <button class="delete-btn" onclick="deleteTransaction('${tx.id}', '${tx.assetType || ''}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function deleteTransaction(id, type){

  openDeleteConfirm(
    "Are you sure you want to delete this?",
    function(){

      google.script.run
        .withSuccessHandler(function(response){

          if(response && response.success){
            showTransactionSuccess("Transaction deleted successfully.");
            loadTransactions();
            loadCryptocurrenciesDashboard();
          }
          else{
            showTransactionError(
              response?.message ||
              "Unable to delete transaction."
            );
          }

        })
        .withFailureHandler(function(error){

          console.error(
            "DELETE ERROR:",
            error
          );

          showTransactionError(
            "Unable to delete transaction."
          );

        })
        .deleteTransaction(id, type);

    }
  );
}

let dashboardLoading = false;

function loadDashboard() {

  if(dashboardLoading){
    console.log("Dashboard load skipped - already loading");
    return;
  }

  dashboardLoading = true;

  showDashboardLoading();

  google.script.run
    .withSuccessHandler(function(data){

      console.log(
        "========== DASHBOARD DATA =========="
      );

      console.log(
        "FULL DATA:",
        JSON.stringify(data, null, 2)
      );

      console.log("SAVINGS:", data?.assets?.savings);
      console.log("CRYPTO:", data?.assets?.cryptocurrencies);
      console.log("PORTFOLIO:", data?.portfolio);

      if(!data) return;

      renderDashboard(data);

      loadDashboardSavings();
      loadPersonalIncome();

    })
    .withFailureHandler(function(error){

      console.error(
        "========== DASHBOARD ERROR ==========",
        error
      );

    })
    .getDashboard();
}


/* =========================
   CRYPTO DASHBOARD
========================= */

function loadCryptocurrenciesDashboard(){

  callAppsScript(
    "getCryptoSummary",
    []
  )

  .then(function(data){

    console.log(
      "CRYPTO SUMMARY DATA:",
      data
    );

    if(!data) return;

    const holdings =
      data.holdings || [];

    renderCryptoSummary({
      categories:{
        Cryptocurrencies: holdings
      }
    });

    renderCryptoHoldings({
      categories:{
        Cryptocurrencies: holdings
      }
    });

  })

  .catch(function(error){

    console.error(
      "Crypto Dashboard Error:",
      error
    );

  });

}
