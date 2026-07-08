import {BadgeDollarSign, BriefcaseBusiness, Bus, Check, CircleEllipsis, Gift, Hospital, HousePlus, Martini, Receipt, ShoppingBag, TrendingUpDown, Utensils, Wrench, X } from "lucide-react"
import type { Transaction } from "./types"
import { useState } from "react"
import { motion } from "motion/react"

type TransactionProps = {
    transaction: Transaction
    onDelete: () => void
    isSelected: boolean
    onToggleSelect: (id: number) => void
    selectMod: boolean
    onUpdate: (updatedTransaction: Transaction) => void
    onEditSelect: (id: number | null) => void
}

export const TransactionItem = ({ transaction, isSelected, selectMod, onToggleSelect, onUpdate, onEditSelect}: TransactionProps) => {

    const [transactionEdit, setTransactionEdit] = useState<number | null>(null)

    const [labelEdit, setLabelEdit] = useState(transaction.label)
    const [amountEdit, setAmountEdit] = useState(transaction.amount.toString())

    return (

        <>
            <div className="w-2/12">
                    <button
                        onClick={() => onToggleSelect(transaction.id)}
                        className={`
                            h-3/5 w-3/5 btn p-2 transition-all duration-300 rounded-2xl
                            ${selectMod && !isSelected
                                ? "btn-outline btn-secondary"
                                : selectMod && isSelected ? "btn-success"
                                : "border-none shadow-none text-base-content/70 hover:text-white/90 hover:scale-105 active:scale-95 hover:bg-success" 
                            }

                            ${!selectMod && transaction.category === "food" ? "bg-warning/15 text-warning"
                                :!selectMod && transaction.category === "housing" ? "bg-primary/15 text-primary" 
                                :!selectMod && transaction.category === "transport" ? "bg-accent/15 text-accent" 
                                :!selectMod && transaction.category === "leisure" ? "bg-secondary/15 text-secondary" 
                                :!selectMod && transaction.category === "shopping" ? "bg-info/15 text-info" 
                                :!selectMod && transaction.category === "health" ? "bg-success/15 text-success" 
                                :!selectMod && transaction.category === "bills" ? "bg-neutral/15 text-neutral" 
                                :!selectMod && transaction.category === "other expense" ? "bg-base-content/15 text-base-content" 
                                :!selectMod && transaction.category === "salary" ? "bg-success/15 text-success" 
                                :!selectMod && transaction.category === "freelance" ? "bg-primary/15 text-primary" 
                                :!selectMod && transaction.category === "investment" ? "bg-info/15 text-info" 
                                :!selectMod && transaction.category === "gift" ? "bg-secondary/15 text-secondary" 
                                :!selectMod && transaction.category === "other income" ? "bg-accent/15 text-accent" 
                                : ""
                            }
                        `}
                    >
                        {selectMod ?
                            <>
                                <X className={`transition-all duration-300 ${!isSelected ? "rotate-180" : "rotate-0 opacity-0 w-0"}`}/>
                                <Check className={`transition-all duration-300 ${isSelected ? "rotate-0" : "rotate-180 opacity-0 w-0"}`}/>
                            </>
                            :transaction.category === "food"
                                ? <Utensils className="" />
                            :transaction.category === "housing"
                                ? <HousePlus className="" />
                            :transaction.category === "transport"
                                ? <Bus className="" />
                            :transaction.category === "leisure"
                                ? <Martini className="" />
                            :transaction.category === "shopping"
                                ? <ShoppingBag className="" />
                            :transaction.category === "health"
                                ? <Hospital className="" />
                            :transaction.category === "bills"
                                ? <Receipt className="" />
                            :transaction.category === "other expense"
                                ? <CircleEllipsis className="" />
                            :transaction.category === "salary"
                                ? <BadgeDollarSign className="" />
                            :transaction.category === "freelance"
                                ? <BriefcaseBusiness className="" />
                            :transaction.category === "investment"
                                ? <TrendingUpDown className="" />
                            :transaction.category === "gift"
                                ? <Gift className="" />
                            :transaction.category === "other income"
                                ? <CircleEllipsis className="" />
                            : ""
                        }
                    </button>
                </div>
                <div className="flex flex-col w-3/12 gap-2 justify-center">
                    {transactionEdit === transaction.id ?
                        <input
                            className="focus-visible:outline-none no-spinner input input-ghost w-full rounded-2xl bg-base-200/50 transition-all duration-500 focus:border-transparent focus:ring-2 focus:ring-primary/30"
                            placeholder={transaction.label}
                            type="string"
                            onChange={(e) => setLabelEdit(e.target.value)}
                            value={labelEdit}
                        />
                        :
                        <>
                            <span className="font-bold">{transaction.label}</span>
                        
                            <span>{transaction.date.toLocaleDateString() === new Date().toLocaleDateString() ? "Today" : transaction.date.toLocaleDateString()}</span>
                        </>
                    }
                </div>
                <motion.div
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex w-5/12 h-full justify-end items-center text-[1.02rem] font-bold ${transaction.type === "income" ? "text-success" : "text-error"}`}
                >
                    {transactionEdit === transaction.id ?
                        <input
                            className="focus-visible:outline-none no-spinner input input-ghost w-6/10 mr-3 rounded-2xl bg-base-200/50 transition-all duration-500 focus:border-transparent focus:ring-2 focus:ring-primary/30"
                            placeholder={transaction.amount.toString()}
                            type="number"
                            onChange={(e) => setAmountEdit(e.target.value)}
                            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                            value={amountEdit}
                        />
                        :
                        <>{transaction.type === "income" ? "+" : "-"} {transaction.amount.toFixed(2)} $</>
                    }
                </motion.div>
                <div className={`flex justify-end items-center ${transactionEdit === transaction.id ? "w-0 overflow-hidden" : "w-2/12"} `}>
                    <button
                        onClick={() => {
                            setTransactionEdit(transaction.id);
                            onEditSelect(transaction.id);
                        }}
                        className={`
                            btn rounded-2xl
                            ${selectMod ? "btn-disabled text-base-content" : "btn-secondary border-none shadow-none bg-secondary/15 hover:bg-secondary text-secondary hover:text-base-content"}
                        `}
                    >
                        <Wrench className=" " />
                    </button>
                </div>
                <div className={`flex mr-3 ${transactionEdit === transaction.id ? "w-2/12" : "w-0 overflow-hidden"}`}>
                    <button 
                        onClick={() => {
                            setLabelEdit(transaction.label)
                            setAmountEdit(transaction.amount.toString())
                            setTransactionEdit(null)
                            onEditSelect(null)
                        }}
                        className="btn btn-outline rounded-l-xl btn-sm btn-secondary"
                    >
                        <X/>
                    </button>
                    <button 
                        onClick={() => {
                            onUpdate({
                                ...transaction,
                                label: labelEdit,
                                amount: Number(amountEdit)
                            })
                            setTransactionEdit(null)
                            onEditSelect(null)
                        }}
                        className="btn btn-outline rounded-r-xl btn-sm btn-success"
                    >
                        <Check/>
                    </button>
                </div>
        </>

    )
}