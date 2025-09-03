import pandas as pd

PRICES_CSV = "data/prices.csv"
SALARIES_CSV = "data/salaries.csv"

def read_prices():
    return pd.read_csv(PRICES_CSV)

def read_salaries():
    return pd.read_csv(SALARIES_CSV)

def compute_correlation(prices_df, salaries_df):
    merged = pd.merge(prices_df, salaries_df, on="year")
    return merged.corr(numeric_only=True)["salary"].to_dict()
