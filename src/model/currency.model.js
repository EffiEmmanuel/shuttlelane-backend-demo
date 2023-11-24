import mongoose from "mongoose";

// SCHEMA: This schema is for Currencies on shuttlelane.com
const currencySchema = new mongoose.Schema(
  {
    currencyLabel: {
      type: String,
      required: true,
    },

    // Exchange rate assumes Naira as the base currency
    exchangeRate: {
      type: String,
      required: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    alias: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CurrencyModel = mongoose.model("Currency", currencySchema);

export default CurrencyModel;
