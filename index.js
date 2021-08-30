//Open and close Modal
const Modal = {
    changeModalState(){
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("Transactions.Itens")) || [] //Json parse transforma o dado em array para ser alocado no localstorage
    },
    set(transactions){
        localStorage.setItem("Transactions.Itens", JSON.stringify(transactions))
    }
}
// Summary Data
const Transaction = {

    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload();
    },
    transactionRemove(index){
        Transaction.all.splice(index, 1)

        App.reload();
    },
    income(){
        let income = 0;

        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0){

                income += transaction.amount;

            }
        })

        return income
    },
    expenses(){
        //somar saídas
        let expense = 0;

        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0){

                expense += transaction.amount;

            }
        })

        return expense

    },
    total(){

        return Transaction.income() + Transaction.expenses();

    }
}

//FormatCurrency
const Utils = {

    formatAmount(value){
        value = Number(value) * 100
        
        return value;
    },

    formatDate(value){
        const splittedDate = value.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0? "-":"";

        value = String(value).replace(/\D/g,"")

        value = Number(value)/100

        value = value.toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        })

        return signal + value
    }
}

//Add values at HTML
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    //Add transaction in table
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)//add innerHTMLTransaction function into HTML

        tr.dataset.index = index

        //create the element tr into "#data-table body"
        DOM.transactionsContainer.appendChild(tr)
    },

   
    //add values in  table
    innerHTMLTransaction(transaction, index){

        //check the class
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        //format currency
        const amount = Utils.formatCurrency(transaction.amount);

        //add values in table
        const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.transactionRemove(${index})"src="./assets/minus.svg" alt="">
                </td>
        `
        return html
    },

    updateSummary(){
        document.getElementById('income').innerHTML = Utils.formatCurrency(Transaction.income())
        document.getElementById('expense').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('total').innerHTML = Utils.formatCurrency(Transaction.total()) 
    },

    clearTransaction(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
 
    validateFields(){
        const { description, amount, date } = Form.getValues();

        if(description.trim() === "" || 
            amount.trim() === ""|| 
            date.trim() === "")
        {
            throw new Error("Preencha o formulário!")

        }
    },

    formatValues(){
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },
    saveTransaction(value){
        Transaction.add(value)
    },
    clearFields(){
        Form.description.value = "",
        Form.amount.value = "",
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

      try {
        Form.validateFields()

        const transaction = Form.formatValues()

        Form.saveTransaction(transaction)

        Form.clearFields()

        Modal.changeModalState();
      }catch (error) {
          alert(error.message)
      }
    }
}


const App ={ 
    init(){

        Transaction.all.forEach( (transaction, index) => {
            DOM.addTransaction(transaction,index)
        })
        
        DOM.updateSummary()

        Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransaction()
        App.init();
    }
}

App.init();