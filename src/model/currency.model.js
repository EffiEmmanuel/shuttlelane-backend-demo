import mongoose from "mongoose";

// SCHEMA: This schema is for Currencies on shuttlelane.com
const currencySchema = new mongoose.Schema(
  {
    currencyLabel: {
      type: String,
      required: true,
    },

    supportedCountries: [
      {
        type: String,
      },
    ],

    // Exchange rate assumes Naira as the base currency
    exchangeRate: {
      type: String,
      required: true,
    },

    // Rate percentage to add (based off the current exchange rate from the exchangeratesapi API)
    exchangeRatePercentage: {
      type: Number,
      required: true,
    },

    // Additional rate to add on the percentage
    additionalRate: {
      type: Number,
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
