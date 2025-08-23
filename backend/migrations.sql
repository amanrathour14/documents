-- Create database (run this first)
-- CREATE DATABASE affiliate_tracking;

-- Connect to the database first, then run these commands:

-- Create affiliates table
CREATE TABLE affiliates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Create campaigns table
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Create clicks table
CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  affiliate_id INT REFERENCES affiliates(id),
  campaign_id INT REFERENCES campaigns(id),
  click_id VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  UNIQUE(affiliate_id, campaign_id, click_id)
);

-- Create conversions table
CREATE TABLE conversions (
  id SERIAL PRIMARY KEY,
  click_id INT REFERENCES clicks(id),
  amount FLOAT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO affiliates (name) VALUES 
  ('John Doe'),
  ('Jane Smith'),
  ('Bob Johnson');

INSERT INTO campaigns (name) VALUES 
  ('Summer Sale 2024'),
  ('Black Friday 2024'),
  ('Holiday Special 2024');

-- Create indexes for better performance
CREATE INDEX idx_clicks_affiliate_id ON clicks(affiliate_id);
CREATE INDEX idx_clicks_campaign_id ON clicks(campaign_id);
CREATE INDEX idx_clicks_click_id ON clicks(click_id);
CREATE INDEX idx_conversions_click_id ON conversions(click_id);