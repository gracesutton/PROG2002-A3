CREATE DATABASE charityevents_db;
USE charityevents_db;

CREATE TABLE Organisations (
	OrganisationID int AUTO_INCREMENT PRIMARY KEY,
    OrganisationName varchar(255) NOT NULL,
    OrganisationDescription varchar(255),
    Website varchar(255),
    Phone varchar(15)
);

CREATE TABLE Categories (
	CategoryID int AUTO_INCREMENT PRIMARY KEY,
    CategoryName varchar(50) NOT NULL,
    CategoryImage VARCHAR(255)
);

CREATE TABLE Events (
    EventID int AUTO_INCREMENT PRIMARY KEY,
    EventName varchar(255) NOT NULL,
    Description varchar(255),
    EventDate date NOT NULL,
    Location varchar(255) NOT NULL,
    TicketPrice decimal(10,2) DEFAULT 0,
	GoalAmount decimal(10,2) DEFAULT 0,
	CurrentProgress decimal(10,2) DEFAULT 0,
    OrganisationID int NOT NULL,
    CategoryID int NOT NULL,
    FOREIGN KEY (OrganisationID) REFERENCES Organisations(OrganisationID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

INSERT INTO Organisations (OrganisationName, Description, Website, Phone) VALUES
('Helping Hands', 'Provides meals and shelter for the homeless', 'https://helpinghands.org', '(07) 5523 7890'),
('Green Earth', 'Environmental conservation initiatives', 'https://greenearth.org', '(07) 5524 4411'),
('Hope for Kids', 'Supports education programs for underprivileged children', 'https://hopeforkids.org', '(07) 5523 1234');

INSERT INTO Categories (CategoryName) VALUES
('Fun Run', 'images/fun-run.jpg'),
('Charity Gala', 'images/gala.jpg'),
('Auction', 'images/auction.jpg'),
('Community Fair', 'images/fair.jpg');

INSERT INTO Events (EventName, Description, EventDate, Location, TicketPrice, GoalAmount, CurrentProgress, OrganisationID, CategoryID) VALUES
('5K Fun Run', 'Join us for a fun run to raise funds for local shelters.', '2025-10-10', 'Coolangatta', 0.00, 5000, 2200, 1, 1),
('Annual Charity Gala', 'An elegant evening to support conservation efforts.', '2025-11-15', 'Gold Coast Convention Centre', 120.00, 20000, 7500, 2, 2),
('Art Auction', 'Bid on local artwork and support kids education.', '2025-12-01', 'HOTA', 0.00, 8000, 3000, 3, 3),
('Spring Community Fair', 'Family-friendly fair with stalls and live music.', '2025-09-30', 'Burleigh Heads Public School', 5.00, 3000, 1500, 1, 4),
('Beach Clean-Up', 'Volunteer event to clean Gold Coast beaches.', '2025-10-20', 'Surfers Paradise Beach', 0.00, 1000, 500, 2, 1),
('Charity Fashion Show', 'Showcasing local designers for a cause.', '2025-12-05', 'Pacific Fair Shopping Centre', 45.00, 7000, 3200, 1, 2),
('Food Drive Gala Dinner', 'Help us fundraise for food packages.', '2025-09-20', 'JW Marriott Gold Coast', 60.00, 5000, 1200, 1, 2),
('Vintage Auction', 'Collectible items auction for fundraising.', '2025-09-09', 'Gold Coast Convention Centre', 0.00, 4000, 1000, 3, 3);


