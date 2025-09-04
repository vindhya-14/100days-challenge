import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
from utils import load_data

# Load Data
df = load_data("../data/food_data.csv")

# Page Configuration
st.set_page_config(
    page_title="Food Waste vs Hunger Gap",
    page_icon="🍽️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inject Custom CSS
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Poppins', sans-serif;
    }
    
    .main {
        background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
        color: #f0f0f0;
    }
    
    .title {
        text-align: center;
        color: #fff;
        font-size: 42px;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .subtitle {
        text-align: center;
        color: #e0e0e0;
        font-size: 18px;
        margin-bottom: 40px;
        font-weight: 300;
    }
    
    .card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 20px;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        margin-bottom: 25px;
    }
    
    .metric-card {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 15px;
        text-align: center;
        border-left: 4px solid #4CAF50;
    }
    
    .stSelectbox div div div {
        color: #333;
    }
    
    div[data-testid="stHorizontalBlock"] {
        gap: 20px;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
    }
    ::-webkit-scrollbar-thumb {
        background: #4CAF50;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #388E3C;
    }
    
    /* Button styling */
    .stButton button {
        background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    }
    
    /* Select box styling */
    .stSelectbox label {
        color: #e0e0e0 !important;
        font-weight: 600;
    }
    
    /* Dataframe styling */
    .dataframe {
        border-radius: 10px;
        overflow: hidden;
    }
    
    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    
    .stTabs [data-baseweb="tab"] {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px 8px 0 0;
        padding: 10px 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Title
st.markdown('<div class="title">🍽️ Food Waste vs Hunger Gap Visualizer</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Explore the paradox of wasted food vs global hunger</div>', unsafe_allow_html=True)

# Calculate metrics for the cards
total_waste = df["Food_Waste_Million_Tons"].sum()
total_hunger = df["Hungry_Population_Million"].sum()
avg_waste_per_country = df["Food_Waste_Million_Tons"].mean()
avg_hunger_per_country = df["Hungry_Population_Million"].mean()

# Create metrics cards
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown(f'<div class="metric-card"><h3>Total Food Waste</h3><h2>{total_waste:.1f}M Tons</h2></div>', unsafe_allow_html=True)
with col2:
    st.markdown(f'<div class="metric-card"><h3>Total Hungry Population</h3><h2>{total_hunger:.1f}M People</h2></div>', unsafe_allow_html=True)
with col3:
    st.markdown(f'<div class="metric-card"><h3>Avg Waste per Country</h3><h2>{avg_waste_per_country:.1f}M Tons</h2></div>', unsafe_allow_html=True)
with col4:
    st.markdown(f'<div class="metric-card"><h3>Avg Hunger per Country</h3><h2>{avg_hunger_per_country:.1f}M People</h2></div>', unsafe_allow_html=True)

# Create tabs for different visualizations
tab1, tab2, tab3, tab4 = st.tabs(["Scatter Plot", "Bar Chart", "Country Comparison", "Raw Data"])

with tab1:
    st.markdown('<div class="card"><h2>Food Waste vs Hungry Population</h2></div>', unsafe_allow_html=True)
    
    # Add animation option
    animate = st.checkbox("Animate by Country", value=False)
    
    if animate:
        fig1 = px.scatter(
            df, 
            x="Food_Waste_Million_Tons", 
            y="Hungry_Population_Million", 
            color="Country",
            size="Hungry_Population_Million",
            hover_name="Country",
            size_max=60,
            animation_frame="Country",
            template="plotly_dark",
            title="Animated View of Food Waste vs Hungry Population"
        )
    else:
        fig1 = px.scatter(
            df, 
            x="Food_Waste_Million_Tons", 
            y="Hungry_Population_Million", 
            color="Country",
            size="Hungry_Population_Million",
            hover_name="Country",
            size_max=60,
            template="plotly_dark",
            title="Food Waste vs Hungry Population"
        )
    
    fig1.update_layout(
        plot_bgcolor='rgba(0, 0, 0, 0.1)',
        paper_bgcolor='rgba(0, 0, 0, 0)',
        font_color="#e0e0e0"
    )
    st.plotly_chart(fig1, use_container_width=True)

with tab2:
    st.markdown('<div class="card"><h2>Comparison Across Countries</h2></div>', unsafe_allow_html=True)
    
    # Sort options
    sort_by = st.radio("Sort by:", ["Food Waste", "Hungry Population"], horizontal=True)
    
    if sort_by == "Food Waste":
        df_sorted = df.sort_values(by="Food_Waste_Million_Tons", ascending=False)
    else:
        df_sorted = df.sort_values(by="Hungry_Population_Million", ascending=False)
    
    fig2 = px.bar(
        df_sorted,
        x="Country",
        y=["Food_Waste_Million_Tons", "Hungry_Population_Million"],
        barmode="group",
        template="plotly_dark",
        title="Food Waste vs Hungry Population by Country",
        labels={"value": "Millions", "variable": "Metric"}
    )
    
    fig2.update_layout(
        plot_bgcolor='rgba(0, 0, 0, 0.1)',
        paper_bgcolor='rgba(0, 0, 0, 0)',
        font_color="#e0e0e0"
    )
    st.plotly_chart(fig2, use_container_width=True)

with tab3:
    st.markdown('<div class="card"><h2>Country Comparison</h2></div>', unsafe_allow_html=True)
    
    # Country selector
    countries = st.multiselect(
        "Select countries to compare:",
        options=df["Country"].unique(),
        default=df["Country"].unique()[:3]
    )
    
    if countries:
        filtered_df = df[df["Country"].isin(countries)]
        
        # Create subplots
        fig = make_subplots(
            rows=1, cols=2,
            subplot_titles=("Food Waste (Million Tons)", "Hungry Population (Million)")
        )
        
        fig.add_trace(
            go.Bar(
                x=filtered_df["Country"],
                y=filtered_df["Food_Waste_Million_Tons"],
                name="Food Waste",
                marker_color="#4CAF50"
            ),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Bar(
                x=filtered_df["Country"],
                y=filtered_df["Hungry_Population_Million"],
                name="Hungry Population",
                marker_color="#FF9800"
            ),
            row=1, col=2
        )
        
        fig.update_layout(
            template="plotly_dark",
            showlegend=False,
            height=500,
            plot_bgcolor='rgba(0, 0, 0, 0.1)',
            paper_bgcolor='rgba(0, 0, 0, 0)',
            font_color="#e0e0e0"
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Calculate ratios
        filtered_df = filtered_df.copy()
        filtered_df["Waste_to_Hunger_Ratio"] = filtered_df["Food_Waste_Million_Tons"] / filtered_df["Hungry_Population_Million"]
        
        ratio_fig = px.bar(
            filtered_df,
            x="Country",
            y="Waste_to_Hunger_Ratio",
            color="Country",
            title="Food Waste to Hunger Ratio (Higher = More Waste Relative to Hunger)",
            template="plotly_dark"
        )
        
        ratio_fig.update_layout(
            plot_bgcolor='rgba(0, 0, 0, 0.1)',
            paper_bgcolor='rgba(0, 0, 0, 0)',
            font_color="#e0e0e0"
        )
        
        st.plotly_chart(ratio_fig, use_container_width=True)
    else:
        st.info("Please select at least one country to compare.")

with tab4:
    st.markdown('<div class="card"><h2>Raw Data</h2></div>', unsafe_allow_html=True)
    
    # Add search and filter options
    search_term = st.text_input("Search for a country:")
    
    if search_term:
        filtered_data = df[df["Country"].str.contains(search_term, case=False)]
    else:
        filtered_data = df
    
    # Show dataframe with gradient
    st.dataframe(
        filtered_data.style.background_gradient(cmap="YlOrRd", subset=["Food_Waste_Million_Tons", "Hungry_Population_Million"]),
        use_container_width=True
    )
    
    # Download button
    @st.cache_data
    def convert_df_to_csv(df):
        return df.to_csv(index=False).encode('utf-8')
    
    csv = convert_df_to_csv(filtered_data)
    
    st.download_button(
        label="Download data as CSV",
        data=csv,
        file_name="food_waste_data.csv",
        mime="text/csv",
    )

# Add footer
st.markdown("---")
st.markdown(
    '<div style="text-align: center; color: #aaa; font-size: 14px;">'
    'Data Visualization App | Created with Streamlit'
    '</div>',
    unsafe_allow_html=True
)