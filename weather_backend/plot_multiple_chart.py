import matplotlib.pyplot as plt
import os

def plot_multiple(data, image_path='static/images/plot1.png'):
    plt.figure(figsize=(20, 6), dpi=300)
    x_data = data.get('validTimeUtc', [])
    
    for key in data.keys():
        if key != 'validTimeUtc': 
            y_data = data[key]
            plt.plot(x_data, y_data, label=key)

    plt.title('weather')
    plt.xlabel('Time')
    plt.ylabel('Value')
    plt.legend()

    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    plt.savefig(image_path)

    plt.close()
