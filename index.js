//Open and close Modal
const Modal = {
    changeModalState(){
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const transactions = [{
    id:1,
    description:'Luz',
    amount:-50000,
    date:'23/03/2021'
},
{
    id:2,
    description:'Website',
    amount:500000,
    date:'23/03/2021'
},
{
    id:3,
    description:'Internet',
    amount:-20000,
    date:'23/03/2021'
}
]

const Transaction = {
    income(){
        let income = 0;

        transactions.forEach((transaction) => {
            if(transaction.amount > 0){

                income += transaction.amount;

            }
        })

        return income
    },
    expenses(){
        //somar saídas
        let expense = 0;

        transactions.forEach((transaction) => {
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img src="./assets/minus.svg" alt="">
                </td>
        `
        return html
    },

    updateSummary(){
        document.getElementById('income').innerHTML = Utils.formatCurrency(Transaction.income())
        document.getElementById('expense').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('total').innerHTML = Utils.formatCurrency(Transaction.total()) 
    }
}

transactions.forEach((transaction)=> {
    DOM.addTransaction(transaction)
})

DOM.updateSummary()