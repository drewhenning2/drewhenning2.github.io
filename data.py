import pandas as pd

# read csv file
df_data = pd.read_csv('Resources/cities.csv')

# save to html
df_data.to_html('data.html', index=False)

# assign to string
table = df_data.to_html()
print(table)