import folium
from folium.plugins import HeatMap
import numpy as np

def generate_synthetic_points(n_points, center, std, bbox):
    """
    Generate synthetic occurrence points.
    
    Parameters:
      n_points: number of synthetic points to generate.
      center: (lon, lat) center for the distribution.
      std: (std_lon, std_lat) standard deviations for point dispersion.
      bbox: [min_lon, min_lat, max_lon, max_lat] bounding box to clip points.
      
    Returns a list of points as [lon, lat] pairs.
    """
    points = np.random.randn(n_points, 2)
    points[:, 0] = points[:, 0] * std[0] + center[0]  # longitude
    points[:, 1] = points[:, 1] * std[1] + center[1]  # latitude
    # Clip points to the bounding box
    points[:, 0] = np.clip(points[:, 0], bbox[0], bbox[2])
    points[:, 1] = np.clip(points[:, 1], bbox[1], bbox[3])
    return points.tolist()

def create_heatmap(species_name, n_points, bbox, center=None, std=None):
    """
    Create an interactive heatmap overlaid on a map of the target Miami‑Dade region.
    
    Parameters:
      species_name: Name of the species (string).
      n_points: Number of synthetic occurrence points.
      bbox: [min_lon, min_lat, max_lon, max_lat] bounding box of the region.
      center: (lon, lat) center for the synthetic distribution (default is the bbox center).
      std: (std_lon, std_lat) standard deviation for the distribution (default is bbox dimensions/8).
      
    The heatmap uses a gradient from blue (low density) to red (high density) and saves
    the output as an HTML file.
    """
    min_lon, min_lat, max_lon, max_lat = bbox
    if center is None:
        center = ((min_lon + max_lon) / 2, (min_lat + max_lat) / 2)
    if std is None:
        std = ((max_lon - min_lon) / 8, (max_lat - min_lat) / 8)
    
    # Generate synthetic occurrence points (longitude, latitude)
    points = generate_synthetic_points(n_points, center, std, bbox)
    
    # Create a folium map centered on our region
    m = folium.Map(location=[center[1], center[0]], zoom_start=12)
    
    # Prepare heatmap data (folium expects [lat, lon] pairs)
    heat_data = [[pt[1], pt[0]] for pt in points]
    
    # Define a gradient with keys as strings to avoid issues
    gradient = { "0.2": "blue", "0.4": "cyan", "0.6": "lime", "0.8": "yellow", "1": "red" }
    
    # Add the heatmap layer
    HeatMap(heat_data,
            gradient=gradient,
            radius=15,
            blur=10
           ).add_to(m)
    
    # Save the map as an HTML file
    filename = species_name.lower().replace(" ", "_") + "_heatmap.html"
    m.save(filename)
    print(f"Heatmap for {species_name} saved as {filename}")

if __name__ == "__main__":
    # Define the bounding box for Homestead through Hollywood area in Miami‑Dade County:
    # [min_lon, min_lat, max_lon, max_lat]
    bbox = [-80.75, 25.45, -80.15, 26.05]
    
    # Generate heatmaps for each species with plausible centers and spreads in this region.
    # Adjust centers and std as needed based on real distribution patterns.
    
    # 1. Burmese Pythons (likely concentrated in the southern part of this region)
    create_heatmap("Burmese Pythons", 1000, bbox, center=(-80.55, 25.55), std=(0.1, 0.1))
    
    # 2. Cane Toads (widespread across the region)
    create_heatmap("Cane Toads", 1200, bbox, center=(-80.45, 25.75), std=(0.15, 0.15))
    
    # 3. Feral Hogs (moderately dispersed, perhaps more in rural outskirts)
    create_heatmap("Feral Hogs", 800, bbox, center=(-80.65, 25.85), std=(0.2, 0.2))
    
    # 4. Green Iguanas (common in urban/suburban areas around Miami)
    create_heatmap("Green Iguanas", 900, bbox, center=(-80.35, 25.65), std=(0.1, 0.1))
    
    # 5. Tegu Lizard (localized pockets)
    create_heatmap("Tegu Lizard", 700, bbox, center=(-80.60, 25.80), std=(0.15, 0.15))
    
    # 6. African Land Snail (scattered or in specific microhabitats)
    create_heatmap("African Land Snail", 600, bbox, center=(-80.50, 25.70), std=(0.2, 0.2))
