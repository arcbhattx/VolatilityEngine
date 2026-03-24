import torch
import torch.nn as nn

class VolatilityLSTM(nn.Module):

    """
    Multi-Horizon volatility forecastor.

    Input: (batch, lookback, n_features)
    Output: (batch, n_horizons) - predicted annaul volatility for each horizon
    
    """
    def __init__(
            self,
            input_size: int,
            hidden_size: int = 128,
            num_layers: int = 2,
            n_horizons: int = 3,
            dropout: float = 0.2, 
    ):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )

        self.norm = nn.BatchNorm1d(hidden_size)  # stabilizes post-LSTM representations
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, n_horizons),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        lstm_out, _ = self.lstm(x)
        last = lstm_out[:, -1, :]
        last = self.norm(last)   # normalize before dropout
        last = self.dropout(last)
        return self.fc(last)