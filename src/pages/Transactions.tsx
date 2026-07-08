import { useEffect, useState } from "react"
import { type Filter, type Category, type Transaction, type TransactionType } from "../types"
import { Input } from "../Input"
import { Select } from "../Select"
import { categoryExpense, categoryIncome, selectedTransactionType } from "../constants"
import { ArrowBigDownDash, BanknoteArrowDown, BanknoteArrowUp, CalendarDays, Check, CheckCheck, Construction, HandCoins, Landmark, ListTodo, Plus, Trash2, Undo2, Wallet, X } from "lucide-react"
import { TransactionItem } from "../TransactionItem"
import { motion, AnimatePresence } from "motion/react"


export default function Transactions() {

    const [openMenuAdd, setOpenMenuAdd] = useState(false)
    const [openFilter, setOpenFilter] = useState({
        categoryExpense: false,
        categoryIncome: false,
        type: false,
        date: false,
    })

    const [transactionLabel, setTransactionLabel] = useState("")
    const [transactionAmount, setTransactionAmount] = useState<string>("")
    const [transactionType, setTransactionType] = useState<TransactionType | "">("")
    const [transactionCategory, setTransactionCategory] = useState<Category | "">("")

    const savedTransactions = localStorage.getItem("transactions")
    const initialTransactions: Transaction[] = savedTransactions
        ? JSON.parse(savedTransactions).map(reviveTransaction)
        : [];
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions))
    }, [transactions])

    const updateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(prev =>
            prev.map(t =>
                t.id === updatedTransaction.id
                    ? updatedTransaction
                    : t
            )
        )
    }

    const isValid =
        transactionLabel.trim() !== "" &&
        transactionAmount.trim() !== "" &&
        transactionType !== "" &&
        transactionCategory !== "";

    function reviveTransaction(t: any): Transaction {
        return {
            ...t,
            date: t.date ? new Date(t.date) : new Date()
        };
    }

    function addTransaction() {
        if (transactionLabel.trim() == "" ||
            transactionAmount.trim() == "" ||
            transactionType === "" ||
            transactionCategory === ""
        ) {
            return
        }

        const newTransation: Transaction = {
            id: Date.now(),
            type: transactionType,
            label: transactionLabel,
            amount: Number(transactionAmount),
            category: transactionCategory,
            date: new Date()
        }

        const newTransactions = [newTransation, ...transactions]

        setTransactions(newTransactions)
        setTransactionLabel("")
        setTransactionAmount("")
        setTransactionType("")
        setTransactionCategory("")
    }

    const selectedCategory: Category[] =
        transactionType === "expense"
            ? categoryExpense
            : categoryIncome

    const [filter, setFilter] = useState<Filter>({
        category: [],
        transactionType: [],
        date: "all",
        editMod: null
    })

    const toggleCategory = (value: Category) => (
        setFilter(prev => {
            const isActive = prev.category.includes(value)

            return {
                ...prev,
                category: isActive
                    ? prev.category.filter(c => c !== value)
                    : [...prev.category, value]
            }
        })
    )

    const toggleTransactionType = (value: TransactionType) => (
        setFilter(prev => {
            const isActive = prev.transactionType.includes(value)

            return {
                ...prev,
                transactionType: isActive
                    ? prev.transactionType.filter(c => c !== value)
                    : [...prev.transactionType, value]
            }
        })
    )

    const initialFilter: Filter = {
        category: [] as Category[],
        transactionType: [] as TransactionType[],
        date: "all",
        editMod: null
    } satisfies Filter

    function resetFilter() {
        setFilter(initialFilter)
    }

    function isThisWeek(date: Date) {
        const now = new Date();
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }

    function isThisMonth(date: Date) {
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    function isThisYear(date: Date) {
        const now = new Date();
        return date.getFullYear() === now.getFullYear();
    }

    const [searchFilter, setSearchFilter] = useState("")

    function onEdit(id: number | null) {

        filter.editMod === id 
        ? setFilter(prev => ({...prev, editMod: null})) 
        : setFilter(prev => ({...prev, editMod: id}))

    }

    let filteredTransactions: Transaction[] = transactions.filter((t) =>
        (filter.editMod === null || t.id === filter.editMod) &&
        (filter.category.length === 0 || filter.category.includes(t.category)) &&
        (filter.transactionType.length === 0 || filter.transactionType.includes(t.type)) &&
        (
            filter.date === "all" ||
            filter.date === "today" && t.date.toLocaleDateString() === new Date().toLocaleDateString() || 
            (filter.date === "week" && isThisWeek(t.date)) || 
            (filter.date === "month" && isThisMonth(t.date)) || 
            (filter.date === "year" && isThisYear(t.date))
        )
    )

    let transactionsRender = filteredTransactions.filter(t => t.label.toLowerCase().includes(searchFilter.toLowerCase()))

    const deleteTransactions = (id: number) => {
        const newTransactions = transactions.filter((t) => t.id !== id)
        setTransactions(newTransactions)
    }

    const [selectedTransactions, setSelectedTransactions] = useState<Set<Number>>(new Set())

    function toggleSelectedTransactions(id: Number) {
        const newSelected = new Set(selectedTransactions)

        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }

        setSelectedTransactions(newSelected)
    }

    function deleteSelectedTransaction() {
        const newTransactions = transactions.filter((t) => {
            if (selectedTransactions.has(t.id)) {
                return false
            } else {
                return true
            }
        })

        setTransactions(newTransactions)
        setSelectedTransactions(new Set())
    }

    const totalIncome = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum, 0)
    const totalExpense = transactions.reduce((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0)
    const balance = totalIncome - totalExpense
    const balanceStat = totalIncome > 0 ? Math.min(Math.max(Math.round((balance / totalIncome) * 100), 0), 100) : 0

    const transactionCount = {
        total: transactions.length,
        income: transactions.filter(t => t.type === "income").length,
        expense: transactions.filter(t => t.type === "expense").length,
        category: {
            food: transactions.filter(t => t.category === "food").length,
            housing: transactions.filter(t => t.category === "housing").length,
            transport: transactions.filter(t => t.category === "transport").length,
            leisure: transactions.filter(t => t.category === "leisure").length,
            shopping: transactions.filter(t => t.category === "shopping").length,
            health: transactions.filter(t => t.category === "health").length,
            bills: transactions.filter(t => t.category === "bills").length,
            otherExpense: transactions.filter(t => t.category === "other expense").length,
            salary: transactions.filter(t => t.category === "salary").length,
            freelance: transactions.filter(t => t.category === "freelance").length,
            investment: transactions.filter(t => t.category === "investment").length,
            gift: transactions.filter(t => t.category === "gift").length,
            otherIncome: transactions.filter(t => t.category === "other income").length
        },
        date: {
            today: transactions.filter(t => t.date.toLocaleDateString() === new Date().toLocaleDateString()).length,
            week: transactions.filter(t => isThisWeek(t.date)).length,
            month: transactions.filter(t => isThisMonth(t.date)).length,
            year: transactions.filter(t => isThisYear(t.date)).length,
        }
    }

    return (
        <>
            <div className="h-full flex flex-col justify-between">
                <div className={`flex flex-col`}>

                    <div className={`flex overflow-hidden border-b border-zinc-500/20 gap-3  transition-all duration-500
                        ${openMenuAdd ? "h-13 pl-1 pt-1 pr-1 pb-12 w-full mb-3" : " h-0 opacity-0"}
                    `}>
                        <Input
                            placeholder="Label..."
                            type="text"
                            value={transactionLabel}
                            onChange={(val) => setTransactionLabel(val)}
                        />
                        <Input
                            placeholder="Amount..."
                            type="number"
                            value={transactionAmount}
                            onChange={(val) => setTransactionAmount(val)}
                            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        />
                        <Select
                            value={transactionType}
                            options={selectedTransactionType}
                            placeholderOption="Choice a type"
                            onChange={(val) => setTransactionType(val as TransactionType)}
                        />
                        <Select
                            value={transactionCategory}
                            options={selectedCategory}
                            placeholderOption="Choise a category"
                            onChange={(val) => setTransactionCategory(val as Category)}
                        />
                        <button disabled={!isValid} onClick={addTransaction} className="btn btn-success rounded-2xl">Add</button>
                    </div>

                    <div className={`flex  flex-col relative w-full h-full`}>

                        <button
                            onClick={() => setOpenMenuAdd(prev => !prev)}
                            className={`swap btn btn-outline shadow-xl rounded-2xl absolute top-0 z-10 left-1/2 -translate-x-1/2 transition-all duration-500 hover:scale-105 active:scale-95
                                ${openMenuAdd ? "btn-secondary" : "hover:btn-primary"}
                                ${openFilter.categoryExpense || openFilter.categoryIncome || openFilter.type || openFilter.date || selectedTransactions.size > 0
                                    ? "opacity-0 p-10 rounded-4xl pointer-events-none"
                                    : ""
                                }
                                ${filter.editMod !== null ? "btn-disabled" : ""}
                            `}
                        >
                            <ArrowBigDownDash className={`h-8 w-8 transition-all duration-500 ${openMenuAdd ? "rotate-180 " : "opacity-0 rotate-0"}`} />
                            <Plus className={`h-8 w-8 transition-all duration-500 ${openMenuAdd ? "rotate-0 opacity-0" : "rotate-180 "}`} />
                        </button>

                        <div className={`relative flex items-center transition-all duration-500 overflow-hidden gap-2 p-3
                            ${openMenuAdd ? "h-0 opacity-0 border-none" : "h-13 w-full mb-8 border-b border-zinc-500/20 pb-3"}
                        `}>

                            <button
                                onClick={() => setOpenFilter(prev => ({
                                    ...prev,
                                    categoryExpense: !prev.categoryExpense
                                }))}
                                className={`swap relative btn btn-outline shadow-sm rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-y-hidden
                                    ${openFilter.categoryExpense && filter.category.length === 0 ? "btn-secondary hover:btn-secondary" : ""}
                                    ${openFilter.categoryExpense && filter.category.length > 0 ? "btn-success hover:btn-success" : ""}
                                    ${openFilter.categoryExpense ? "btn-secondary" : "hover:btn-primary"}
                                    ${filter.category.length > 0 && filter.category.some(item => categoryExpense.includes(item)) ? "btn-primary" : ""}
                                    ${filter.editMod !== null ? "btn-disabled" : ""}
                                    ${openFilter.type || openFilter.categoryIncome || openFilter.date || selectedTransactions.size > 0 ? " opacity-0 pointer-events-none h-0 p-0 m-0" : ""}
                                `}
                            >
                                <ListTodo className={`h-8 w-8 transition-all duration-500 ${openFilter.categoryExpense ? "rotate-180 opacity-0" : "rotate-0"}`} />
                                <X className={`h-8 w-8 transition-all duration-500 ${openFilter.categoryExpense && filter.category.length === 0 ? "rotate-180 " : "opacity-0 rotate-0 "}`} />
                                <Check className={`h-8 w-8 transition-all duration-500 ${openFilter.categoryExpense && filter.category.length > 0 ? "rotate-0 " : "opacity-0 rotate-180 "}`} />
                            </button>
                            <div className={`flex gap-2 transition-all duration-500 overflow-hidden
                                    ${openFilter.categoryExpense ? "max-w-175 p-2 mr-2" : "max-w-0 p-0 pointer-events-none opacity-0"}
                                `}
                            >
                                <button
                                    onClick={() => toggleCategory("food")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("food") ? "btn-dash btn-primary" : "btn-outline"}
                               `}
                                >
                                    Food
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.food === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.food}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("housing")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("housing") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Housing
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.housing === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.housing}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("transport")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("transport") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Transport
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.transport === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.transport}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("leisure")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("leisure") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Leisure
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.leisure === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.leisure}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("shopping")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("shopping") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Shopping
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.shopping === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.shopping}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("health")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("health") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Health
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.health === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.health}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("bills")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("bills") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Bills
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.bills === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.bills}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("other expense")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("other expense") ? "btn-dash btn-primary" : "btn-outline"}
                                `}
                                >
                                    Other
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.otherExpense === 0 ? "opacity-0" : ""}
                                        `}
                                    >
                                        {transactionCount.category.otherExpense}
                                    </span>
                                </button>
                            </div>

                            <button
                                onClick={() => setOpenFilter(prev => ({
                                    ...prev,
                                    categoryIncome: !prev.categoryIncome
                                }))}
                                className={`swap btn btn-outline shadow-sm rounded-2xl transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95
                                    ${openFilter.categoryIncome && filter.category.length === 0 ? "btn-secondary hover:btn-secondary" : ""}
                                    ${openFilter.categoryIncome && filter.category.length > 0 ? "btn-success hover:btn-success" : ""}
                                    ${openFilter.categoryIncome ? "btn-secondary" : "hover:btn-primary"}
                                    ${filter.category.length > 0 && filter.category.some(item => categoryIncome.includes(item)) ? "btn-primary" : ""}
                                    ${filter.editMod !== null ? "btn-disabled" : ""}
                                    ${openFilter.type || openFilter.date || openFilter.categoryExpense || selectedTransactions.size > 0 ? " opacity-0 pointer-events-none h-0 p-0 m-0" : ""}
                                `}
                            >
                                <HandCoins className={`h-8 w-8 transition-all duration-500 ${openFilter.categoryIncome ? "rotate-180 opacity-0" : "rotate-0"}`} />
                                <X className={`h-8 w-8 transition-all duration-500 ${openFilter.categoryIncome && filter.category.length === 0 ? "rotate-180 " : "opacity-0 rotate-0 "}`} />
                                <Check className={`h-8 w-8 transition-all duration-500 ${openFilter.categoryIncome && filter.category.length > 0 ? "rotate-0 " : "opacity-0 rotate-180 "}`} />
                            </button>
                            <div className={`flex gap-2 transition-all duration-500 overflow-hidden
                                    ${openFilter.categoryIncome ? "max-w-175 p-2" : "max-w-0 p-0 pointer-events-none opacity-0"}
                            `}
                            >
                                <button
                                    onClick={() => toggleCategory("salary")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("salary") ? "btn-dash btn-primary " : "btn-outline"}
                               `}
                                >
                                    Salary
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.salary === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.salary}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("freelance")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("freelance") ? "btn-dash btn-primary " : "btn-outline"}
                                `}
                                >
                                    Freelance
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.freelance === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.freelance}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("investment")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("investment") ? "btn-dash btn-primary " : "btn-outline"}
                                `}
                                >
                                    Investment
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.investment === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.investment}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("gift")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("gift") ? "btn-dash btn-primary " : "btn-outline"}
                                `}
                                >
                                    Gift
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.gift === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.gift}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleCategory("other income")}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.category.includes("other income") ? "btn-dash btn-primary " : "btn-outline"}
                                `}
                                >
                                    Other
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.category.otherIncome === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.category.otherIncome}
                                    </span>
                                </button>
                            </div>

                            <button
                                onClick={() => setOpenFilter(prev => ({
                                    ...prev,
                                    type: !prev.type
                                }))}
                                className={`
                                    swap btn btn-outline shadow-sm overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95
                                    ${openFilter.type && filter.transactionType.length === 0 ? "btn-secondary hover:btn-secondary" : ""}
                                    ${openFilter.type && filter.transactionType.length > 0 ? "btn-success hover:btn-success" : ""}
                                    ${openFilter.type ? "btn-secondary" : "hover:btn-primary"}
                                    ${filter.transactionType.length > 0 ? "btn-primary" : ""}
                                    ${filter.editMod !== null ? "btn-disabled" : ""}
                                    ${openFilter.categoryExpense || openFilter.categoryIncome || openFilter.date || selectedTransactions.size > 0 ? " opacity-0 pointer-events-none h-0 p-0 m-0" : ""}
                                `}
                            >
                                <Landmark className={`h-8 w-8 transition-all duration-500 ${openFilter.type ? "rotate-180 opacity-0" : "rotate-0"}`} />
                                <X className={`h-8 w-8 transition-all duration-500 ${openFilter.type && filter.transactionType.length === 0 ? "rotate-180 " : "opacity-0 rotate-0 "}`} />
                                <Check className={`h-8 w-8 transition-all duration-500 ${openFilter.type && filter.transactionType.length > 0 ? "rotate-0 " : "opacity-0 rotate-180 "}`} />
                            </button>
                            <div className={`flex gap-2 transition-all duration-500 overflow-hidden
                                    ${openFilter.type ? "max-w-100 p-1" : "max-w-0 p-0 pointer-events-none opacity-0"}
                                `}
                            >
                                <button
                                    onClick={() => toggleTransactionType("income")}
                                    className={`btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.transactionType.includes("income") ? "btn-dash btn-primary  px-5" : "btn-outline"}
                                    `}
                                >
                                    Income
                                </button>
                                <button
                                    onClick={() => toggleTransactionType("expense")}
                                    className={`btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.transactionType.includes("expense") ? "btn-dash btn-primary  px-5" : "btn-outline"}
                                    `}
                                >
                                    Expense
                                </button>
                            </div>

                            <button
                                onClick={() => setOpenFilter(prev => ({
                                    ...prev,
                                    date: !prev.date
                                }))}
                                className={`swap btn btn-outline shadow-sm overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95
                                ${openFilter.date ? "btn-secondary" : "hover:btn-primary"}
                                ${filter.editMod !== null ? "btn-disabled" : ""}
                                ${openFilter.categoryExpense || openFilter.categoryIncome || openFilter.type || selectedTransactions.size > 0 ? "opacity-0 pointer-events-none h-0 p-0 m-0" : ""}
                                ${filter.date !== "all" ? "btn-primary" : ""}
                                `}>
                                <CalendarDays className={`h-8 w-8 transition-all duration-500 ${openFilter.date ? "rotate-180 opacity-0" : "rotate-0"}`} />
                                <X className={`h-8 w-8 transition-all duration-500 ${openFilter.date ? "rotate-180 " : "opacity-0 rotate-0 "}`} />
                            </button>
                            <div className={`flex gap-2 transition-all duration-500 overflow-hidden
                                    ${openFilter.date ? "max-w-120 p-2" : "max-w-0 p-0 pointer-events-none opacity-0"}
                                `}
                            >
                                <button
                                    onClick={() => setFilter(prev => ({ ...prev, date: prev.date === "today" ? "all" : "today" }))}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.date === "today" ? "btn-dash btn-primary  px-5" : "btn-outline"}
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.date.today === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.date.today}
                                    </span>
                                    Today
                                </button>
                                <button
                                    onClick={() => setFilter(prev => ({ ...prev, date: prev.date === "week" ? "all" : "week" }))}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.date === "week" ? "btn-dash btn-primary  px-5" : "btn-outline"}
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.date.week === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.date.week}
                                    </span>
                                    This week
                                </button>
                                <button
                                    onClick={() => setFilter(prev => ({ ...prev, date: prev.date === "month" ? "all" : "month" }))}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.date === "month" ? "btn-dash btn-primary  px-5" : "btn-outline"}
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.date.month === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.date.month}
                                    </span>
                                    This month
                                </button>
                                <button
                                    onClick={() => setFilter(prev => ({ ...prev, date: prev.date === "year" ? "all" : "year" }))}
                                    className={`relative btn btn-sm rounded-xl hover:btn-primary hover:scale-105 active:scale-95 transition-all duration-300
                                    ${filter.date === "year" ? "btn-dash btn-primary  px-5" : "btn-outline"}
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content
                                            ${transactionCount.date.year === 0 ? "opacity-0" : ""}
                                            `}
                                    >
                                        {transactionCount.date.year}
                                    </span>
                                    This year
                                </button>
                            </div>

                            <button
                                onClick={resetFilter}
                                className={`btn btn-outline btn-error btn-glass shadow-sm overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95
                                    ${openFilter.categoryExpense || openFilter.categoryIncome || openFilter.type || openFilter.date || selectedTransactions.size > 0 || filter.category.length === 0 && filter.transactionType.length === 0 && filter.date === "all"
                                        ? "opacity-0 pointer-events-none h-0 p-0 m-0"
                                        : ""
                                    }
                                    ${filter.editMod !== null ? "btn-disabled" : ""}
                                `}
                            >
                                <Undo2 className={`h-8 w-8 transition-all duration-500
                                        ${filter.category.length === 0 && filter.transactionType.length === 0 && filter.date === "all" ? "-rotate-180" : ""}
                                    `} />
                            </button>

                            <div
                                className={`
                                            absolute top-0 flex px-20 gap-10 transition-all duration-200 overflow-hidden p-1
                                            ${selectedTransactions.size === 0 ? "h-0 w-0 opacity-0 pointer-events-none scale-0" : "h-full w-full scale-100"}
                                        `}
                            >
                                <button
                                    className={`
                                            btn btn-outline btn-secondary shadow-sm rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95
                                            ${selectedTransactions.size === 0 ? "opacity-0 pointer-events-none scale-50" : "scale-100"}
                                        `}
                                    onClick={() => setSelectedTransactions(new Set)}
                                >
                                    <X />
                                </button>
                                <button
                                    className={`
                                            relative btn btn-outline btn-accent shadow-sm rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95
                                            ${selectedTransactions.size === 0 ? "opacity-0 pointer-events-none scale-50" : "scale-100"}
                                            ${selectedTransactions.size === transactionsRender.length ? "btn-active" : ""}
                                        `}
                                    onClick={() => setSelectedTransactions(
                                        new Set(transactionsRender.map(t => t.id))
                                    )}
                                >
                                    <span
                                        className="absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content"
                                    >
                                        {transactionCount.total}
                                    </span>
                                    <CheckCheck />
                                </button>
                                <button
                                    className={`
                                            btn btn-outline btn-error shadow-sm rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95
                                            ${selectedTransactions.size === 0 ? "opacity-0 pointer-events-none scale-50" : "scale-100"}
                                        `}
                                    onClick={deleteSelectedTransaction}
                                >
                                    <span
                                        className="absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-[10px] font-medium text-primary-content"
                                    >
                                        {selectedTransactions.size}
                                    </span>
                                    <Trash2 />
                                </button>
                            </div>

                            <input
                                type="search"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                placeholder="Search..."
                                className={`
                                    bg-base-200/50 border-none input input-bordered rounded-2xl ml-auto
                                    focus-visible:outline-none no-spinner input-ghost transition-all duration-500 focus:border-transparent focus:ring-2 focus:ring-primary/30
                                    ${openFilter.categoryExpense || openFilter.categoryIncome || openFilter.type || openFilter.date || selectedTransactions.size > 0 ? "w-0 opacity-0 pointer-events-none" : ""}
                                `}
                            />
                        </div>
                    </div>
                </div>

                <div className={`flex h-10/12 ${openMenuAdd ? "" : ""} `}>
                    <div className="relative menu w-full rounded-3xl overflow-y-auto h-full scrollbar-none">
                        <div className="space-y-3">
                            <AnimatePresence>
                                {transactionsRender.length > 0 ?
                                    transactionsRender.map((t => (
                                        <motion.div
                                            key={t.id}
                                            layout
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1, }}
                                            exit={{ opacity: 0, y: -10, scale: 0.90 }}
                                            transition={{ duration: 0.3 }}
                                            className={`
                                                        flex h-20 w-full bg-base-100/50 transition-colors shadow-sm duration-500 rounded-2xl p-4 items-center
                                                        ${selectedTransactions.size > 0 ? "scale-95" : ""}
                                                    `}
                                        >
                                            <TransactionItem
                                                transaction={t}
                                                onDelete={() => deleteTransactions(t.id)}
                                                isSelected={selectedTransactions.has(t.id)}
                                                onToggleSelect={toggleSelectedTransactions}
                                                selectMod={selectedTransactions.size > 0}
                                                onUpdate={updateTransaction}
                                                onEditSelect={onEdit}
                                            />
                                        </motion.div>
                                    )))

                                    :

                                    <div className="absolute top-0 left-0 flex flex-col justify-center items-center p-5 w-full h-full">
                                        <Construction strokeWidth={1} className="w-7/10 h-7/10 text-purple-400" />
                                        <span className="text-2xl">No transactions</span>
                                    </div>
                                }

                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-full gap-3">
                        <div className="flex relative h-3/9 bg-base-100/30 rounded-2xl p-1 shadow-sm transition-all duration-500">
                            <Wallet className="h-10 w-10 absolute inset-0 top-1/4 left-1/2 -translate-1/2" />
                            <div className="flex flex-col justify-center items-center h-full w-full">
                                <span className="text-3xl mb-2">Balance</span>
                                <span className={balance >= 0 ? "text-4xl text-success/80" : "text-3xl text-error/80"}>
                                    {balance < 0 ? "-" : ""}{balance.toFixed(2)} $
                                </span>
                            </div>
                            <div className="flex justify-center items-center h-full w-full scale-115">
                                <div
                                    className="radial-progress text-success"
                                    style={{ "--value": balanceStat } as React.CSSProperties}
                                    aria-valuenow={balanceStat}
                                    role="progressbar"
                                >
                                    {balanceStat}%
                                </div>
                            </div>
                        </div>
                        <div className="flex h-3/9 gap-3">
                            <div className="flex flex-col h-full w-full justify-center items-center bg-base-100/30 rounded-2xl shadow-sm transition-all duration-500">
                                <span className="text-2xl rounded-xl px-2 py-1">Total</span>
                                <span className="text-5xl mt-5">{transactionCount.total}</span>
                            </div>
                            <div className="flex flex-col h-full w-full justify-center items-center bg-base-100/30 rounded-2xl shadow-sm transition-all duration-500">
                                <span className="text-2xl rounded-xl px-2 py-1">Income</span>
                                <span className="text-5xl mt-5">{transactionCount.income}</span>
                            </div>
                            <div className="flex flex-col h-full w-full justify-center items-center bg-base-100/30 rounded-2xl shadow-sm transition-all duration-500">
                                <span className="text-2xl rounded-xl px-2 py-1">Expense</span>
                                <span className="text-5xl mt-5">{transactionCount.expense}</span>
                            </div>
                        </div>
                        <div className="flex h-3/9 gap-3">
                            <div className="flex flex-col relative justify-center items-center w-full bg-base-100/30 rounded-2xl p-2 shadow-sm transition-all duration-500">
                                <BanknoteArrowDown className="h-10 w-10 absolute inset-0 top-3 left-1/2 -translate-x-1/2" />
                                <span className="text-2xl mb-2">Income</span>
                                <span className="font text-3xl text-success/80">+{totalIncome.toFixed(2)}$</span>
                            </div>
                            <div className="flex flex-col relative justify-center items-center w-full bg-base-100/30 rounded-2xl p-2 shadow-sm transition-all duration-500">
                                <BanknoteArrowUp className="h-10 w-10 absolute inset-0 top-3 left-1/2 -translate-x-1/2" />
                                <span className="text-2xl mb-2">Expense</span>
                                <span className="font text-3xl text-error/80">-{totalExpense.toFixed(2)}$</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}