import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EnhancedEconomySystem = () => {
  // Products list with more realistic demand/supply
  const [products, setProducts] = useState([
    { id: 1, name: "Bread", basePrice: 10, price: 10, demand: 0.8, supply: 0.7, category: "Basic" },
    { id: 2, name: "Water", basePrice: 5, price: 5, demand: 0.9, supply: 0.9, category: "Basic" },
    { id: 3, name: "Housing", basePrice: 500, price: 500, demand: 0.6, supply: 0.5, category: "Luxury" },
    { id: 4, name: "Electronics", basePrice: 200, price: 200, demand: 0.5, supply: 0.6, category: "Technology" },
    { id: 5, name: "Healthcare", basePrice: 150, price: 150, demand: 0.7, supply: 0.6, category: "Service" },
    { id: 6, name: "Education", basePrice: 300, price: 300, demand: 0.6, supply: 0.5, category: "Service" },
    { id: 7, name: "Transportation", basePrice: 100, price: 100, demand: 0.7, supply: 0.7, category: "Service" },
    { id: 8, name: "Energy", basePrice: 80, price: 80, demand: 0.8, supply: 0.6, category: "Utility" },
    { id: 9, name: "Software", basePrice: 250, price: 250, demand: 0.5, supply: 0.7, category: "Technology" },
    { id: 10, name: "Agricultural Products", basePrice: 50, price: 50, demand: 0.6, supply: 0.8, category: "Basic" }
  ]);

  // Historical data for graphs
  const [historicalData, setHistoricalData] = useState({
    giniCoefficient: [],
    classDistribution: [],
    productPrices: {},
    averageCapital: [],
    manipulationEvents: [],
  });

  // Update wealth level function with more levels
  const updateLevel = (capital) => {
    if (capital >= 3000) return "Elite";
    if (capital >= 2000) return "Rich";
    if (capital >= 1200) return "Upper Middle";
    if (capital >= 800) return "Middle";
    if (capital >= 400) return "Lower Middle";
    return "Poor";
  };

  // Create 100 players function with more diverse distribution
  const createPlayers = () => {
    const strategies = ["Balanced", "Risky", "Conservative", "Aggressive", "Innovative", "Technological", "Speculative"];
    const players = [];
    for (let i = 1; i <= 100; i++) {
      // Create a more realistic wealth distribution
      let capital;
      if (i <= 5) {
        capital = 3000 + Math.floor(Math.random() * 2000); // Elite (5%)
      } else if (i <= 15) {
        capital = 2000 + Math.floor(Math.random() * 1000); // Rich (10%)
      } else if (i <= 35) {
        capital = 1200 + Math.floor(Math.random() * 800); // Upper Middle (20%)
      } else if (i <= 65) {
        capital = 800 + Math.floor(Math.random() * 400); // Middle (30%)
      } else if (i <= 85) {
        capital = 400 + Math.floor(Math.random() * 400); // Lower Middle (20%)
      } else {
        capital = 100 + Math.floor(Math.random() * 300); // Poor (15%)
      }

      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const player = {
        id: i,
        name: i === 50 ? "Player" : `Player ${i}`,
        capital: capital,
        level: updateLevel(capital),
        cycle: 1,
        strategy: strategy,
        inventoryValue: 0,
        manipulationPoints: 0,
        penaltyTime: 0,
        imprisonmentRecord: 0, // New: tracks how many times player was imprisoned
        robinHoodPoints: 0,
        specialStatus: null, // Can be "Watchlist", "Imprisoned", etc.
        inventory: products.map(product => ({
          productId: product.id,
          quantity: Math.floor(Math.random() * 5)
        })),
        // Player specialization by product category
        specialization: Math.random() > 0.7 ? 
          products[Math.floor(Math.random() * products.length)].category : null,
        capitalHistory: [capital] // Track capital over time
      };
      players.push(player);
    }
    return players;
  };

  // Players
  const [players, setPlayers] = useState(createPlayers());

  // System parameters with more fine-tuning options
  const [parameters, setParameters] = useState({
    transformationRate: 0.2,       // Capital transformation rate
    balancingFactor: 0.15,         // Balancing factor
    eliteLimit: 3000,              // Elite wealth limit
    wealthLimit: 2000,             // Rich wealth limit
    upperMiddleLimit: 1200,        // Upper middle limit
    middleLimit: 800,              // Middle limit
    lowerMiddleLimit: 400,         // Lower middle limit
    cycleTime: 1,                  // Cycle time (seconds)
    speedMultiplier: 1,            // Speed multiplier for simulation
    active: false,                 // Is simulation active?
    robinHoodModeActive: true,     // Robin Hood mode (enabled by default)
    robinHoodRate: 0.1,            // Rate to take from rich
    eliteRobinHoodRate: 0.15,      // Higher rate to take from elite
    manipulationThreshold: 3,      // Manipulation detection threshold
    imprisonmentThreshold: 2,      // Number of penalties before imprisonment
    penaltyDuration: 5,            // Manipulation penalty duration (turns)
    imprisonmentDuration: 15,      // Imprisonment duration (longer penalty)
    autoBailout: false,            // If true, system occasionally helps poorest players
    bailoutThreshold: 5,           // Percentage of players that trigger bailout
    marketVolatility: 0.5,         // Affects price movements (0.1-1.0)
    showDetailedStats: false,      // Toggle for detailed statistical view
    autoEvents: true               // Whether random market events occur automatically
  });

  // Turn count
  const [turnCount, setTurnCount] = useState(1);
  
  // Game messages with categories
  const [messages, setMessages] = useState([
    { text: "Enhanced Economy System initialized with advanced features.", category: "system" },
    { text: "100 players, realistic wealth distribution, and detailed penalties added.", category: "system" },
    { text: "Robin Hood mode is ON by default. Click Start to begin simulation.", category: "system" }
  ]);

  // Selected player for detailed view
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Active tab for statistics
  const [activeTab, setActiveTab] = useState("general");

  // Market events with more specific effects and targeting
  const marketEvents = [
    { 
      event: "Economic Recession", 
      effectCapital: -0.15, 
      effectProduct: { categories: ["Luxury", "Technology"], priceChange: -0.2 },
      effectSpecialization: { target: "Technology", modifier: -0.1 },
      target: "Everyone", 
      duration: 3, // Events can now have lasting effects
      description: "An economic downturn reduces spending on luxury and technology goods."
    },
    { 
      event: "Tech Boom", 
      effectCapital: 0.1, 
      effectProduct: { categories: ["Technology"], priceChange: 0.3 },
      effectSpecialization: { target: "Technology", modifier: 0.25 },
      target: ["Innovative", "Technological"], 
      duration: 2,
      description: "Technological advancements benefit tech-focused players and products."
    },
    { 
      event: "Agricultural Crisis", 
      effectCapital: -0.05, 
      effectProduct: { categories: ["Basic"], priceChange: 0.4 },
      effectSpecialization: { target: "Basic", modifier: -0.15 },
      target: "Everyone",
      duration: 4,
      description: "Food shortages cause basic goods prices to rise significantly."
    },
    { 
      event: "Healthcare Reform", 
      effectCapital: 0.05, 
      effectProduct: { categories: ["Service"], priceChange: -0.15 },
      effectSpecialization: { target: "Service", modifier: 0.1 },
      target: "Poor",
      duration: 3,
      description: "New healthcare policies make medical services more affordable."
    },
    { 
      event: "Energy Crisis", 
      effectCapital: -0.1, 
      effectProduct: { categories: ["Utility", "Transportation"], priceChange: 0.25 },
      effectSpecialization: { target: "Utility", modifier: 0.2 },
      target: "Everyone",
      duration: 3,
      description: "Energy shortages affect transportation and utility prices."
    },
    { 
      event: "Housing Bubble", 
      effectCapital: -0.2, 
      effectProduct: { categories: ["Luxury"], priceChange: -0.3 },
      effectSpecialization: { target: "Luxury", modifier: -0.25 },
      target: "Rich",
      duration: 4,
      description: "A collapse in luxury housing values affects wealthy investors."
    },
    { 
      event: "Educational Subsidy", 
      effectCapital: 0.1, 
      effectProduct: { categories: ["Service"], priceChange: -0.1 },
      effectSpecialization: { target: "Service", modifier: 0.05 },
      target: ["Poor", "Lower Middle"],
      duration: 3,
      description: "Government subsidies make education more accessible to lower classes."
    },
    { 
      event: "Natural Disaster", 
      effectCapital: -0.15, 
      effectProduct: { categories: ["Basic", "Housing"], priceChange: 0.35 },
      effectSpecialization: { target: null, modifier: 0 },
      target: "Everyone",
      duration: 5,
      description: "A major disaster disrupts supply chains and damages infrastructure."
    },
    { 
      event: "Market Speculation", 
      effectCapital: 0.3, 
      effectProduct: { categories: ["Technology", "Luxury"], priceChange: 0.4 },
      effectSpecialization: { target: "Luxury", modifier: 0.3 },
      target: ["Speculative", "Aggressive", "Risky"],
      duration: 1,
      description: "Market speculation creates a short-lived bubble beneficial to risk-takers."
    },
    { 
      event: "War", 
      effectCapital: -0.25, 
      effectProduct: { categories: ["Basic", "Utility"], priceChange: 0.5 },
      effectSpecialization: { target: null, modifier: 0 },
      target: "Everyone",
      duration: 6,
      description: "Armed conflict disrupts the economy and causes severe shortages."
    }
  ];
  
  // Active market events (can now have multiple active events with durations)
  const [activeEvents, setActiveEvents] = useState([]);

  // Add new message with category
  const addMessage = (message, category = "system") => {
    setMessages(previousMessages => [
      { text: message, category: category }, 
      ...previousMessages.slice(0, 19)
    ]);
  };

  // Random market event with more complex effects
  const triggerMarketEvent = () => {
    if (Math.random() > 0.7 || !parameters.autoEvents) return null; // 30% chance or disabled
    
    const event = { 
      ...marketEvents[Math.floor(Math.random() * marketEvents.length)],
      startTurn: turnCount,
      id: Date.now() // Unique ID for this event instance
    };
    
    setActiveEvents(prev => [...prev, event]);
    
    addMessage(`Market Event: ${event.event} - ${event.description}`, "event");
    
    // Apply product price effects based on categories
    if (event.effectProduct.categories && event.effectProduct.categories.length > 0) {
      setProducts(previousProducts => {
        return previousProducts.map(product => {
          if (event.effectProduct.categories.includes(product.category)) {
            const newPrice = Math.round(product.price * (1 + event.effectProduct.priceChange));
            addMessage(`${product.name} price ${product.price > newPrice ? "decreased" : "increased"} to ${newPrice} due to ${event.event}`, "market");
            return {...product, price: newPrice};
          }
          return product;
        });
      });
    }
    
    return event;
  };

  // Clean up expired events
  const cleanupEvents = () => {
    setActiveEvents(prev => 
      prev.filter(event => (turnCount - event.startTurn) < event.duration)
    );
  };

  // More sophisticated manipulation check with imprisonment
  const manipulationCheck = () => {
    setPlayers(previousPlayers => {
      const newPlayers = [...previousPlayers];
      
      // Random players try to manipulate, with more factors affecting probability
      if (turnCount % 2 === 0) {
        // Players more likely to manipulate if they're losing money or have aggressive strategies
        const manipulationCandidates = newPlayers.filter(p => {
          if (p.penaltyTime > 0 || p.specialStatus === "Imprisoned") return false;
          
          const isLosingMoney = p.capitalHistory.length >= 3 && 
            p.capitalHistory[p.capitalHistory.length-1] < p.capitalHistory[p.capitalHistory.length-3];
          
          const baseChance = p.strategy === "Aggressive" ? 0.15 : 
                            p.strategy === "Speculative" ? 0.12 :
                            p.strategy === "Risky" ? 0.08 : 0.03;
          
          const desperation = isLosingMoney ? 0.1 : 0;
          const watchlistModifier = p.specialStatus === "Watchlist" ? -0.05 : 0;
          
          return Math.random() < (baseChance + desperation + watchlistModifier);
        });
        
        manipulationCandidates.forEach(player => {
          // Manipulation severity based on strategy and level
          const baseSeverity = 
            player.strategy === "Aggressive" ? 0.35 :
            player.strategy === "Speculative" ? 0.30 :
            player.strategy === "Risky" ? 0.25 : 0.15;
          
          const levelModifier = 
            player.level === "Elite" ? 0.15 :
            player.level === "Rich" ? 0.1 : 0;
            
          const manipulationSeverity = baseSeverity + levelModifier + (Math.random() * 0.2);
          
          // Detection chance increases with severity and previous history
          const historyModifier = player.manipulationPoints * 0.1;
          const detectionChance = (manipulationSeverity * 0.6) + historyModifier;
          
          if (Math.random() < detectionChance) {
            // Caught manipulating
            const playerIndex = newPlayers.findIndex(p => p.id === player.id);
            newPlayers[playerIndex].manipulationPoints += 1;
            
            if (newPlayers[playerIndex].manipulationPoints >= parameters.manipulationThreshold) {
              // Check if player should be imprisoned (repeat offender)
              if (newPlayers[playerIndex].imprisonmentRecord >= parameters.imprisonmentThreshold) {
                // Send to prison
                newPlayers[playerIndex].specialStatus = "Imprisoned";
                newPlayers[playerIndex].penaltyTime = parameters.imprisonmentDuration;
                newPlayers[playerIndex].capital = Math.round(newPlayers[playerIndex].capital * 0.7); // 30% capital loss
                newPlayers[playerIndex].imprisonmentRecord += 1;
                
                addMessage(`${player.name} is a repeat offender and has been IMPRISONED for ${parameters.imprisonmentDuration} turns with a 30% capital fine!`, "warning");
                
                // Add to historical data
                setHistoricalData(prev => ({
                  ...prev,
                  manipulationEvents: [...prev.manipulationEvents, {
                    turn: turnCount,
                    player: player.name,
                    type: "Imprisonment",
                    severity: "Major"
                  }]
                }));
              } else {
                // Regular penalty
                newPlayers[playerIndex].penaltyTime = parameters.penaltyDuration;
                newPlayers[playerIndex].capital = Math.round(newPlayers[playerIndex].capital * 0.8); // 20% capital loss
                newPlayers[playerIndex].imprisonmentRecord += 1; // Increment record
                newPlayers[playerIndex].specialStatus = "Watchlist"; // Add to watchlist
                
                addMessage(`${player.name} caught manipulating! Penalized for ${parameters.penaltyDuration} turns and added to watchlist.`, "warning");
                
                // Add to historical data
                setHistoricalData(prev => ({
                  ...prev,
                  manipulationEvents: [...prev.manipulationEvents, {
                    turn: turnCount,
                    player: player.name,
                    type: "Penalty",
                    severity: "Medium"
                  }]
                }));
              }
              
              // Reset manipulation points after penalty
              newPlayers[playerIndex].manipulationPoints = 0;
            } else {
              addMessage(`${player.name} showing suspicious activity. System monitoring...`, "warning");
            }
          } else {
            // Successful manipulation
            const playerIndex = newPlayers.findIndex(p => p.id === player.id);
            const gain = Math.round(newPlayers[playerIndex].capital * manipulationSeverity);
            newPlayers[playerIndex].capital += gain;
            
            // If gain is substantial, add suspicious activity record
            if (manipulationSeverity > 0.25) {
              setHistoricalData(prev => ({
                ...prev,
                manipulationEvents: [...prev.manipulationEvents, {
                  turn: turnCount,
                  player: player.name,
                  type: "Suspicious",
                  severity: "Low"
                }]
              }));
            }
          }
        });
      }
      
      // Reduce penalty time and manage special statuses
      return newPlayers.map(player => {
        if (player.penaltyTime > 0) {
          const newPenaltyTime = player.penaltyTime - 1;
          
          // When penalty expires, maybe remove from watchlist (50% chance)
          if (newPenaltyTime === 0 && player.specialStatus === "Watchlist" && Math.random() > 0.5) {
            return {...player, penaltyTime: newPenaltyTime, specialStatus: null};
          }
          
          // When imprisonment ends, always move to watchlist
          if (newPenaltyTime === 0 && player.specialStatus === "Imprisoned") {
            addMessage(`${player.name} released from imprisonment but remains on watchlist.`, "system");
            return {...player, penaltyTime: newPenaltyTime, specialStatus: "Watchlist"};
          }
          
          return {...player, penaltyTime: newPenaltyTime};
        }
        return player;
      });
    });
  };

  // Enhanced Robin Hood mechanism with progressive rates
  const robinHoodMechanism = () => {
    if (!parameters.robinHoodModeActive) return;
    
    const elitePlayers = players.filter(p => p.level === "Elite" && p.penaltyTime === 0 && p.specialStatus !== "Imprisoned");
    const richPlayers = players.filter(p => p.level === "Rich" && p.penaltyTime === 0 && p.specialStatus !== "Imprisoned");
    const poorPlayers = players.filter(p => p.level === "Poor" && p.penaltyTime === 0);
    const lowerMiddlePlayers = players.filter(p => p.level === "Lower Middle" && p.penaltyTime === 0);
    
    if ((elitePlayers.length === 0 && richPlayers.length === 0) || 
        (poorPlayers.length === 0 && lowerMiddlePlayers.length === 0)) return;
    
    let totalTransfer = 0;
    
    // Collect from elite and rich with different rates
    const newPlayers = [...players];
    
    // Higher rate from elite
    elitePlayers.forEach(elite => {
      const index = newPlayers.findIndex(p => p.id === elite.id);
      const transfer = Math.round(elite.capital * parameters.eliteRobinHoodRate);
      newPlayers[index].capital -= transfer;
      newPlayers[index].robinHoodPoints -= transfer;
      totalTransfer += transfer;
    });
    
    // Standard rate from rich
    richPlayers.forEach(rich => {
      const index = newPlayers.findIndex(p => p.id === rich.id);
      const transfer = Math.round(rich.capital * parameters.robinHoodRate);
      newPlayers[index].capital -= transfer;
      newPlayers[index].robinHoodPoints -= transfer;
      totalTransfer += transfer;
    });
    
    // Distribute, with more going to poor than lower-middle
    const totalRecipients = poorPlayers.length + (lowerMiddlePlayers.length * 0.5); // Poor get full share, lower-middle get half
    const perPoorPersonTransfer = Math.floor(totalTransfer / totalRecipients);
    const perLowerMiddlePersonTransfer = Math.floor(perPoorPersonTransfer * 0.5);
    
    poorPlayers.forEach(poor => {
      const index = newPlayers.findIndex(p => p.id === poor.id);
      newPlayers[index].capital += perPoorPersonTransfer;
      newPlayers[index].robinHoodPoints += perPoorPersonTransfer;
    });
    
    lowerMiddlePlayers.forEach(lowerMiddle => {
      const index = newPlayers.findIndex(p => p.id === lowerMiddle.id);
      newPlayers[index].capital += perLowerMiddlePersonTransfer;
      newPlayers[index].robinHoodPoints += perLowerMiddlePersonTransfer;
    });
    
    setPlayers(newPlayers);
    addMessage(`Robin Hood redistribution: ${totalTransfer} units transferred from ${elitePlayers.length} elite and ${richPlayers.length} rich to ${poorPlayers.length} poor and ${lowerMiddlePlayers.length} lower-middle class players.`, "system");
  };

  // More dynamic product price updates with supply/demand forces
  const updateProductPrices = () => {
    setProducts(previousProducts => {
      return previousProducts.map(product => {
        // Base forces: supply-demand imbalance
        const supplyDemandEffect = (product.demand - product.supply) * (0.1 * parameters.marketVolatility);
        
        // Random market forces
        const randomFluctuation = ((Math.random() - 0.5) * 0.05 * parameters.marketVolatility);
        
        // Event effects (already applied separately)
        const changeRate = supplyDemandEffect + randomFluctuation;
        
        // Volatility limiter
        const maxChange = 0.1 + (0.1 * parameters.marketVolatility);
        const limitedChange = Math.max(Math.min(changeRate, maxChange), -maxChange);
        
        // Calculate new price
        let newPrice = Math.round(product.price * (1 + limitedChange));
        
        // Price bounds
        const lowerLimit = product.basePrice * 0.4;
        const upperLimit = product.basePrice * 2.5;
        newPrice = Math.max(Math.min(newPrice, upperLimit), lowerLimit);
        
        // Supply and demand also change dynamically
        // High prices reduce demand and increase supply
        let newDemand = product.demand;
        let newSupply = product.supply;
        
        if (newPrice > product.basePrice * 1.5) {
          // High price: demand goes down, supply goes up
          newDemand = Math.max(product.demand - (Math.random() * 0.05), 0.1);
          newSupply = Math.min(product.supply + (Math.random() * 0.05), 1.0);
        } else if (newPrice < product.basePrice * 0.7) {
          // Low price: demand goes up, supply goes down
          newDemand = Math.min(product.demand + (Math.random() * 0.05), 1.0);
          newSupply = Math.max(product.supply - (Math.random() * 0.05), 0.1);
        } else {
          // Normal price: small random changes
          newDemand = Math.max(Math.min(product.demand + ((Math.random() - 0.5) * 0.03), 1.0), 0.1);
          newSupply = Math.max(Math.min(product.supply + ((Math.random() - 0.5) * 0.03), 1.0), 0.1);
        }
        
        // Add price to historical data (every 10 turns)
        if (turnCount % 10 === 0) {
          setHistoricalData(prev => {
            const productPrices = {...prev.productPrices};
            if (!productPrices[product.name]) {
              productPrices[product.name] = [];
            }
            productPrices[product.name].push({
              turn: turnCount,
              price: newPrice
            });
            return {...prev, productPrices};
          });
        }
        
        // Report significant price changes
        if (Math.abs(newPrice - product.price) / product.price > 0.1) {
          addMessage(`${product.name} price ${newPrice > product.price ? "increased" : "decreased"} from ${product.price} to ${newPrice}`, "market");
        }
        
        return {...product, price: newPrice, demand: newDemand, supply: newSupply};
      });
    });
  };

  // Update inventory values
  const updateInventoryValues = () => {
    setPlayers(previousPlayers => {
      return previousPlayers.map(player => {
        let totalValue = 0;
        player.inventory.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            totalValue += item.quantity * product.price;
          }
        });
        return {...player, inventoryValue: totalValue};
      });
    });
  };

  // More diverse trading strategy based on player strategy and specialization
  const tradeSimulation = () => {
    setPlayers(previousPlayers => {
      const newPlayers = [...previousPlayers];
      
      newPlayers.forEach((player, index) => {
        if (player.penaltyTime > 0 || player.specialStatus === "Imprisoned") return; // Penalized players cannot trade
        
        // Base trading probability by strategy
        const strategyTradeProbability = 
          player.strategy === "Aggressive" ? 0.7 :
          player.strategy === "Speculative" ? 0.8 :
          player.strategy === "Risky" ? 0.6 :
          player.strategy === "Innovative" ? 0.5 :
          player.strategy === "Technological" ? 0.4 :
          player.strategy === "Balanced" ? 0.4 : 0.3;
        
        // Actual trading chance, affected by market events
        let actualTradeProbability = strategyTradeProbability;
        
        // Market events can affect trading (e.g., recession reduces trading)
        activeEvents.forEach(event => {
          if (event.event === "Economic Recession") {
            actualTradeProbability *= 0.7; // Reduced trading during recession
          } else if (event.event === "Market Speculation") {
            actualTradeProbability *= 1.5; // Increased trading during speculation
          }
        });
        
        // Limit to valid probability range
        actualTradeProbability = Math.min(Math.max(actualTradeProbability, 0.1), 0.9);
        
        if (Math.random() < actualTradeProbability) {
          // Select product - players prefer their specialization
          let productPool = [...products];
          
          // If player has specialization, 70% chance they trade in that category
          if (player.specialization && Math.random() < 0.7) {
            productPool = products.filter(p => p.category === player.specialization);
            // If somehow empty, revert to all products
            if (productPool.length === 0) productPool = [...products];
          }
          
          const product = productPool[Math.floor(Math.random() * productPool.length)];
          
          // Buy or sell decision depends on strategy
          // Aggressive buy more when prices are rising, conservative buy more when prices are falling
          const priceRising = product.price > product.basePrice;
          
          const buyProbability = 
            (player.strategy === "Aggressive" && priceRising) ? 0.8 :
            (player.strategy === "Aggressive" && !priceRising) ? 0.3 :
            (player.strategy === "Conservative" && priceRising) ? 0.2 :
            (player.strategy === "Conservative" && !priceRising) ? 0.7 :
            (player.strategy === "Speculative") ? 0.6 : 0.5;
          
          const makePurchase = Math.random() < buyProbability;
          
          if (makePurchase && player.capital >= product.price) {
            // Product purchase
            newPlayers[index].capital -= product.price;
            
            // Find product in inventory or add new
            const inventoryIndex = newPlayers[index].inventory.findIndex(e => e.productId === product.id);
            if (inventoryIndex !== -1) {
              newPlayers[index].inventory[inventoryIndex].quantity += 1;
            } else {
              newPlayers[index].inventory.push({ productId: product.id, quantity: 1 });
            }
            
            // Update total value
            newPlayers[index].inventoryValue += product.price;
            
            // Increase demand slightly
            const productIndex = products.findIndex(p => p.id === product.id);
            if (productIndex !== -1) {
              const productsCopy = [...products];
              productsCopy[productIndex].demand = Math.min(productsCopy[productIndex].demand + 0.02, 1);
              setProducts(productsCopy);
            }
            
          } else if (!makePurchase) {
            // Product sale
            const inventoryIndex = newPlayers[index].inventory.findIndex(e => e.productId === product.id && e.quantity > 0);
            
            if (inventoryIndex !== -1) {
              newPlayers[index].inventory[inventoryIndex].quantity -= 1;
              newPlayers[index].capital += product.price;
              newPlayers[index].inventoryValue -= product.price;
              
              // Increase supply slightly
              const productIndex = products.findIndex(p => p.id === product.id);
              if (productIndex !== -1) {
                const productsCopy = [...products];
                productsCopy[productIndex].supply = Math.min(productsCopy[productIndex].supply + 0.02, 1);
                setProducts(productsCopy);
              }
            }
          }
        }
      });
      
      return newPlayers;
    });
  };

  // System bailout for poorest players (prevents complete collapse)
  const systemBailout = () => {
    const poorCount = players.filter(p => p.level === "Poor").length;
    const poorPercentage = poorCount / players.length;
    
    if (poorPercentage >= parameters.bailoutThreshold / 100 && parameters.autoBailout) {
      const poorPlayers = players.filter(p => p.level === "Poor");
      const newPlayers = [...players];
      
      let bailoutTotal = 0;
      
      poorPlayers.forEach(poor => {
        const index = newPlayers.findIndex(p => p.id === poor.id);
        const bailoutAmount = Math.max(parameters.middleLimit - poor.capital, 0) / 2; // Halfway to Middle
        
        if (bailoutAmount > 0) {
          newPlayers[index].capital += bailoutAmount;
          bailoutTotal += bailoutAmount;
        }
      });
      
      if (bailoutTotal > 0) {
        setPlayers(newPlayers);
        addMessage(`System bailout: ${Math.round(bailoutTotal)} units distributed to ${poorPlayers.length} players in poverty.`, "system");
      }
    }
  };

  // More complex capital transformation with multiple factors
  const capitalTransformation = () => {
    // Process active events and generate new ones
    cleanupEvents();
    const newEvent = triggerMarketEvent();
    
    // Manipulation check
    manipulationCheck();
    
    // Update product values
    updateProductPrices();
    
    // Trade simulation
    tradeSimulation();
    
    // Update inventory values
    updateInventoryValues();
    
    // Robin Hood mechanism every 5 turns
    if (turnCount % 5 === 0) {
      robinHoodMechanism();
    }
    
    // System bailout check every 10 turns
    if (turnCount % 10 === 0) {
      systemBailout();
    }
    
    setPlayers(previousPlayers => {
      return previousPlayers.map(player => {
        if (player.penaltyTime > 0 || player.specialStatus === "Imprisoned") {
          // Penalized players don't get capital changes
          return {
            ...player, 
            capitalHistory: [...player.capitalHistory, player.capital]
          };
        }
        
        let newCapital = player.capital;
        
        // Base strategy factor - more volatile for risky strategies
        const strategyBaseFactor =
          player.strategy === "Aggressive" ? (Math.random() > 0.5 ? 0.5 : -0.3) :
          player.strategy === "Speculative" ? (Math.random() > 0.5 ? 0.6 : -0.5) :
          player.strategy === "Risky" ? (Math.random() > 0.5 ? 0.4 : -0.3) :
          player.strategy === "Innovative" ? (Math.random() > 0.6 ? 0.35 : -0.25) :
          player.strategy === "Technological" ? (Math.random() > 0.55 ? 0.3 : -0.2) :
          player.strategy === "Balanced" ? (Math.random() > 0.5 ? 0.2 : -0.1) :
          (Math.random() > 0.5 ? 0.15 : -0.05); // Conservative
        
        // Progressive balancing factor - stronger effect at extremes
        const balancingFactor = 
          player.level === "Elite" ? -parameters.balancingFactor * 1.5 :
          player.level === "Rich" ? -parameters.balancingFactor * 1.2 :
          player.level === "Upper Middle" ? -parameters.balancingFactor * 0.5 :
          player.level === "Lower Middle" ? parameters.balancingFactor * 0.5 :
          player.level === "Poor" ? parameters.balancingFactor * 1.5 : 0;
        
        // Market event effects
        let eventEffect = 0;
        activeEvents.forEach(event => {
          // Check if player matches target group
          const targetMatches = 
            event.target === "Everyone" ||
            (typeof event.target === 'string' && event.target === player.level) ||
            (Array.isArray(event.target) && (
              event.target.includes(player.level) || 
              event.target.includes(player.strategy)
            ));
          
          if (targetMatches) {
            eventEffect += event.effectCapital;
          }
          
          // Specialization effects
          if (event.effectSpecialization && 
             event.effectSpecialization.target === player.specialization) {
            eventEffect += event.effectSpecialization.modifier;
          }
        });
        
        // Inventory effect - small boost from having assets
        const inventoryEffect = player.inventoryValue > 0 ? 
          Math.min(player.inventoryValue * 0.01 / player.capital, 0.08) : 0;
        
        // Experience effect - players get slightly better over time at managing capital
        const experienceEffect = Math.min(player.cycle / 10000, 0.05);
        
        // Total change rate - with randomness
        const changeRate = (parameters.transformationRate * strategyBaseFactor) + 
                          balancingFactor + eventEffect + inventoryEffect + experienceEffect;
        
        // Apply change rate (with bounds to prevent extreme changes)
        const boundedChangeRate = Math.max(Math.min(changeRate, 0.5), -0.3);
        newCapital = Math.max(100, Math.round(player.capital * (1 + boundedChangeRate)));
        
        // Update level
        const newLevel = updateLevel(newCapital);
        
        // Level change message (player or 10% of others)
        if (newLevel !== player.level && (player.name === "Player" || Math.random() > 0.9)) {
          const direction = isHigherLevel(newLevel, player.level) ? "risen" : "fallen";
          addMessage(`${player.name} has ${direction} to ${newLevel} level!`, "status");
        }
        
        return {
          ...player,
          capital: newCapital,
          level: newLevel,
          cycle: player.cycle + 1,
          capitalHistory: [...player.capitalHistory, newCapital]
        };
      });
    });
    
    // Update turn count
    setTurnCount(previousTurn => previousTurn + 1);
    
    // Update historical data every 5 turns
    if (turnCount % 5 === 0) {
      updateHistoricalData();
    }
    
    // Log milestone
    if (turnCount % 100 === 0) {
      addMessage(`Economic milestone: ${turnCount} turns completed.`, "system");
    }
  };

  // Helper to compare social levels
  const isHigherLevel = (level1, level2) => {
    const levels = ["Poor", "Lower Middle", "Middle", "Upper Middle", "Rich", "Elite"];
    return levels.indexOf(level1) > levels.indexOf(level2);
  }

  // Update historical data for graphs
  const updateHistoricalData = () => {
    // Update Gini coefficient history
    setHistoricalData(prev => ({
      ...prev,
      giniCoefficient: [...prev.giniCoefficient, {
        turn: turnCount,
        value: calculateGini()
      }],
      averageCapital: [...prev.averageCapital, {
        turn: turnCount,
        value: Math.round(players.reduce((sum, p) => sum + p.capital, 0) / players.length)
      }],
      classDistribution: [...prev.classDistribution, {
        turn: turnCount,
        Elite: players.filter(p => p.level === "Elite").length,
        Rich: players.filter(p => p.level === "Rich").length,
        "Upper Middle": players.filter(p => p.level === "Upper Middle").length,
        Middle: players.filter(p => p.level === "Middle").length,
        "Lower Middle": players.filter(p => p.level === "Lower Middle").length,
        Poor: players.filter(p => p.level === "Poor").length
      }]
    }));
  };

  // Start/stop simulation
  const simulationToggle = () => {
    setParameters({...parameters, active: !parameters.active});
    if (!parameters.active) {
      addMessage("Simulation started. Economy is now running.", "system");
    } else {
      addMessage("Simulation paused.", "system");
    }
  };

  // Toggle Robin Hood mode
  const robinHoodToggle = () => {
    setParameters({...parameters, robinHoodModeActive: !parameters.robinHoodModeActive});
    if (!parameters.robinHoodModeActive) {
      addMessage("Robin Hood mode activated. Wealth redistribution is now active.", "system");
    } else {
      addMessage("Robin Hood mode deactivated. No automatic wealth redistribution.", "system");
    }
  };

  // Toggle auto bailout
  const bailoutToggle = () => {
    setParameters({...parameters, autoBailout: !parameters.autoBailout});
    if (!parameters.autoBailout) {
      addMessage("System bailout activated. The poorest will receive assistance.", "system");
    } else {
      addMessage("System bailout deactivated. No automatic assistance for the poor.", "system");
    }
  };

  // Toggle detailed stats
  const toggleDetailedStats = () => {
    setParameters({...parameters, showDetailedStats: !parameters.showDetailedStats});
  };

  // Change simulation speed
  const changeSpeed = (multiplier) => {
    setParameters({...parameters, speedMultiplier: multiplier});
    addMessage(`Simulation speed set to ${multiplier}x`, "system");
  };

  // Toggle auto events
  const toggleAutoEvents = () => {
    setParameters({...parameters, autoEvents: !parameters.autoEvents});
    if (parameters.autoEvents) {
      addMessage("Automatic market events disabled.", "system");
    } else {
      addMessage("Automatic market events enabled.", "system");
    }
  };

  // Change player strategy
  const changeStrategy = (id) => {
    setPlayers(previousPlayers => {
      return previousPlayers.map(player => {
        if (player.id === id) {
          const strategies = ["Balanced", "Risky", "Conservative", "Aggressive", "Innovative", "Technological", "Speculative"];
          const currentIndex = strategies.indexOf(player.strategy);
          const newIndex = (currentIndex + 1) % strategies.length;
          const newStrategy = strategies[newIndex];
          
          addMessage(`${player.name} changed strategy to ${newStrategy}.`, "player");
          return {...player, strategy: newStrategy};
        }
        return player;
      });
    });
  };

  // Change market volatility
  const changeVolatility = (newVolatility) => {
    setParameters({...parameters, marketVolatility: newVolatility});
    addMessage(`Market volatility set to ${newVolatility}`, "system");
  };

  // Toggle player selection for detailed view
  const togglePlayerSelection = (player) => {
    if (selectedPlayer && selectedPlayer.id === player.id) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(player);
    }
  };

  // Cyclic timer with speed control
  useEffect(() => {
    let timer;
    if (parameters.active) {
      timer = setInterval(() => {
        capitalTransformation();
      }, (parameters.cycleTime * 1000) / parameters.speedMultiplier);
    }
    return () => clearInterval(timer);
  }, [parameters.active, parameters.speedMultiplier, turnCount]);

  // Calculate economic statistics
  const economicStatistics = () => {
    const totalCapital = players.reduce((total, player) => total + player.capital, 0);
    const totalInventoryValue = players.reduce((total, player) => total + player.inventoryValue, 0);
    const avgCapital = Math.round(totalCapital / players.length);
    
    // Count by level
    const eliteCount = players.filter(p => p.level === "Elite").length;
    const richCount = players.filter(p => p.level === "Rich").length;
    const upperMiddleCount = players.filter(p => p.level === "Upper Middle").length;
    const middleCount = players.filter(p => p.level === "Middle").length;
    const lowerMiddleCount = players.filter(p => p.level === "Lower Middle").length;
    const poorCount = players.filter(p => p.level === "Poor").length;
    
    const penalizedCount = players.filter(p => p.penaltyTime > 0).length;
    const imprisonedCount = players.filter(p => p.specialStatus === "Imprisoned").length;
    const watchlistCount = players.filter(p => p.specialStatus === "Watchlist").length;

    // Get top 5 richest
    const topRichest = [...players]
      .sort((a, b) => b.capital - a.capital)
      .slice(0, 5);
    
    // Get top 5 poorest
    const topPoorest = [...players]
      .sort((a, b) => a.capital - b.capital)
      .slice(0, 5);
    
    // Get penalized/imprisoned players
    const penalizedPlayers = players.filter(p => 
      p.penaltyTime > 0 || p.specialStatus === "Imprisoned" || p.specialStatus === "Watchlist"
    );
    
    // Find the player (id=50)
    const player = players.find(p => p.name === "Player");
    
    // Calculate Gini coefficient (inequality index)
    const giniCoefficient = calculateGini();
    
    return {
      totalCapital,
      totalInventoryValue,
      avgCapital,
      eliteCount,
      richCount,
      upperMiddleCount,
      middleCount,
      lowerMiddleCount,
      poorCount,
      penalizedCount,
      imprisonedCount,
      watchlistCount,
      topRichest,
      topPoorest,
      penalizedPlayers,
      player,
      giniCoefficient
    };
  };

  // Calculate Gini coefficient
  const calculateGini = () => {
    const sortedCapitals = players.map(p => p.capital).sort((a, b) => a - b);
    const n = sortedCapitals.length;
    
    if (n === 0) return 0;
    
    const mean = sortedCapitals.reduce((a, b) => a + b, 0) / n;
    if (mean === 0) return 0;
    
    let sumOfAbsoluteDifferences = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        sumOfAbsoluteDifferences += Math.abs(sortedCapitals[i] - sortedCapitals[j]);
      }
    }
    
    const gini = sumOfAbsoluteDifferences / (2 * n * n * mean);
    return Math.round(gini * 100) / 100;
  };

  const stats = economicStatistics();

  // Helper function for capital color based on social class
  const capitalColor = (level) => {
    switch (level) {
      case "Elite": return "text-purple-600 font-bold";
      case "Rich": return "text-green-600 font-bold";
      case "Upper Middle": return "text-teal-600";
      case "Middle": return "text-blue-600";
      case "Lower Middle": return "text-yellow-600";
      case "Poor": return "text-red-600";
      default: return "";
    }
  };

  // Helper function for status color
  const statusColor = (status) => {
    switch (status) {
      case "Imprisoned": return "bg-red-100 text-red-800 px-2 py-1 rounded";
      case "Watchlist": return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded";
      default: return "";
    }
  };
  
  // Generate class distribution data for pie chart
  const classDistributionData = [
    { name: "Elite", value: stats.eliteCount, color: "#9f7aea" },
    { name: "Rich", value: stats.richCount, color: "#48bb78" },
    { name: "Upper Middle", value: stats.upperMiddleCount, color: "#38b2ac" },
    { name: "Middle", value: stats.middleCount, color: "#4299e1" },
    { name: "Lower Middle", value: stats.lowerMiddleCount, color: "#ecc94b" },
    { name: "Poor", value: stats.poorCount, color: "#f56565" }
  ];
  
  // Generate strategy distribution data
  const strategyDistribution = () => {
    const counts = {
      "Balanced": 0,
      "Risky": 0,
      "Conservative": 0,
      "Aggressive": 0,
      "Innovative": 0,
      "Technological": 0,
      "Speculative": 0
    };
    
    players.forEach(player => {
      if (counts[player.strategy] !== undefined) {
        counts[player.strategy]++;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  
  // GRAPHS & CHARTS
  
  // Render Gini coefficient history chart
  const renderGiniChart = () => {
    if (historicalData.giniCoefficient.length < 2) return <p>Not enough data points yet...</p>;
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData.giniCoefficient}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="turn" label={{ value: 'Turn', position: 'insideBottom', offset: 0 }} />
            <YAxis label={{ value: 'Gini', angle: -90, position: 'insideLeft' }} domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  // Render class distribution history chart
  const renderClassDistributionChart = () => {
    if (historicalData.classDistribution.length < 2) return <p>Not enough data points yet...</p>;
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historicalData.classDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="turn" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Elite" stackId="a" fill="#9f7aea" />
            <Bar dataKey="Rich" stackId="a" fill="#48bb78" />
            <Bar dataKey="Upper Middle" stackId="a" fill="#38b2ac" />
            <Bar dataKey="Middle" stackId="a" fill="#4299e1" />
            <Bar dataKey="Lower Middle" stackId="a" fill="#ecc94b" />
            <Bar dataKey="Poor" stackId="a" fill="#f56565" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Render player capital history chart
  const renderPlayerCapitalChart = (player) => {
    if (!player || player.capitalHistory.length < 2) return <p>No player selected or not enough data...</p>;
    
    const data = player.capitalHistory.map((capital, index) => ({
      turn: index,
      capital: capital
    }));
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="turn" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="capital" stroke="#3182ce" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Render pie chart of class distribution
  const renderClassPieChart = () => {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={classDistributionData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {classDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Render product price history chart
  const renderProductPricesChart = () => {
    const productNames = Object.keys(historicalData.productPrices);
    if (productNames.length === 0) return <p>Not enough price data collected yet...</p>;
    
    // Prepare data for the chart
    const data = [];
    let maxLength = 0;
    
    productNames.forEach(name => {
      const priceData = historicalData.productPrices[name];
      if (priceData && priceData.length > maxLength) {
        maxLength = priceData.length;
      }
    });
    
    // Create unified data points for all products
    for (let i = 0; i < maxLength; i++) {
      const dataPoint = { turn: i * 10 }; // We collect every 10 turns
      
      productNames.forEach(name => {
        const priceData = historicalData.productPrices[name];
        if (priceData && i < priceData.length) {
          dataPoint[name] = priceData[i].price;
        }
      });
      
      data.push(dataPoint);
    }
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="turn" />
            <YAxis />
            <Tooltip />
            <Legend />
            {productNames.map((name, index) => (
              <Line 
                key={name}
                type="monotone" 
                dataKey={name} 
                stroke={`hsl(${index * 30}, 70%, 50%)`} 
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-3xl font-bold text-center mb-2">Enhanced Gamified Economy System</h1>
        <h2 className="text-xl text-center mb-4">Advanced Cyclical Capital Model</h2>
        
        {/* Control Panel */}
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <h3 className="font-bold text-lg mb-2">Control Panel</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button 
              onClick={simulationToggle}
              className={`px-4 py-2 rounded-lg font-bold ${parameters.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {parameters.active ? 'Stop' : 'Start'}
            </button>
            
            <button 
              onClick={() => capitalTransformation()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
              disabled={parameters.active}
            >
              Manual Turn
            </button>
            
            <button 
              onClick={robinHoodToggle}
              className={`px-4 py-2 rounded-lg font-bold ${parameters.robinHoodModeActive ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white'}`}
            >
              {parameters.robinHoodModeActive ? 'Disable Robin Hood' : 'Enable Robin Hood'}
            </button>
            
            <button 
              onClick={bailoutToggle}
              className={`px-4 py-2 rounded-lg font-bold ${parameters.autoBailout ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white'}`}
            >
              {parameters.autoBailout ? 'Disable Bailouts' : 'Enable Bailouts'}
            </button>
            
            <button 
              onClick={toggleAutoEvents}
              className={`px-4 py-2 rounded-lg font-bold ${parameters.autoEvents ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white'}`}
            >
              {parameters.autoEvents ? 'Disable Events' : 'Enable Events'}
            </button>
            
            <button 
              onClick={toggleDetailedStats}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold"
            >
              {parameters.showDetailedStats ? 'Simple View' : 'Detailed View'}
            </button>
            
            <div className="col-span-2 flex">
              <span className="mr-2 flex items-center text-sm">Speed:</span>
              {[0.5, 1, 2, 5, 10].map(speed => (
                <button 
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-2 py-1 rounded mr-1 text-xs ${parameters.speedMultiplier === speed ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex items-center">
              <span className="mr-2 text-sm">Market Volatility:</span>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1"
                value={parameters.marketVolatility}
                onChange={(e) => changeVolatility(parseFloat(e.target.value))}
                className="flex-grow"
              />
              <span className="ml-2 text-sm">{parameters.marketVolatility}</span>
            </div>
          </div>
        </div>
        
        {/* Main Statistics Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Economic Stats Panel */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg border-b pb-1 mb-2">Economic Statistics</h3>
            <p>Turn: <span className="font-bold">{turnCount}</span></p>
            <p>Total Capital: <span className="font-bold">{stats.totalCapital.toLocaleString()}</span></p>
            <p>Average Capital: <span className="font-bold">{stats.avgCapital.toLocaleString()}</span></p>
            <p>Gini Coefficient: <span className="font-bold">{stats.giniCoefficient}</span></p>
            
            <div className="mt-2">
              <p className="font-semibold">Class Distribution:</p>
              <div className="grid grid-cols-2 gap-x-2 text-sm">
                <p>Elite: <span className="font-bold text-purple-600">{stats.eliteCount}</span></p>
                <p>Rich: <span className="font-bold text-green-600">{stats.richCount}</span></p>
                <p>Upper Middle: <span className="font-bold text-teal-600">{stats.upperMiddleCount}</span></p>
                <p>Middle: <span className="font-bold text-blue-600">{stats.middleCount}</span></p>
                <p>Lower Middle: <span className="font-bold text-yellow-600">{stats.lowerMiddleCount}</span></p>
                <p>Poor: <span className="font-bold text-red-600">{stats.poorCount}</span></p>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="font-semibold">Judicial System:</p>
              <div className="grid grid-cols-3 gap-x-2 text-sm">
                <p>Penalized: <span className="font-bold text-orange-600">{stats.penalizedCount}</span></p>
                <p>Imprisoned: <span className="font-bold text-red-600">{stats.imprisonedCount}</span></p>
                <p>Watchlist: <span className="font-bold text-yellow-600">{stats.watchlistCount}</span></p>
              </div>
            </div>
          </div>
          
          {/* Active Events Panel */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg border-b pb-1 mb-2">Active Events</h3>
            <div className="max-h-48 overflow-y-auto">
              {activeEvents.length > 0 ? (
                activeEvents.map(event => (
                  <div key={event.id} className="mb-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="font-semibold">{event.event}</p>
                    <p className="text-sm">{event.description}</p>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Effect: <span className={event.effectCapital > 0 ? "text-green-600" : "text-red-600"}>
                        {event.effectCapital > 0 ? '+' : ''}{Math.round(event.effectCapital * 100)}%
                      </span></span>
                      <span>Turns left: {event.duration - (turnCount - event.startTurn)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 italic">No active market events</p>
              )}
            </div>
          </div>
          
          {/* Products Panel */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg border-b pb-1 mb-2">Products & Market</h3>
            <div className="h-48 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="mb-1 border-b pb-1 text-sm">
                  <div className="flex justify-between">
                    <span>{product.name}</span>
                    <span className="font-bold">{product.price}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Demand: {Math.round(product.demand * 100)}%</span>
                    <span>Supply: {Math.round(product.supply * 100)}%</span>
                    <span className="text-gray-500">{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Data Visualization Tabs */}
        {parameters.showDetailedStats && (
          <div className="mb-4">
            <div className="border-b border-gray-200 mb-2">
              <nav className="flex -mb-px">
                <button 
                  onClick={() => setActiveTab("general")}
                  className={`py-2 px-4 font-medium text-sm rounded-t ${
                    activeTab === "general" ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab("classes")}
                  className={`py-2 px-4 font-medium text-sm rounded-t ${
                    activeTab === "classes" ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                  Class Distribution
                </button>
                <button 
                  onClick={() => setActiveTab("prices")}
                  className={`py-2 px-4 font-medium text-sm rounded-t ${
                    activeTab === "prices" ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                  Product Prices
                </button>
                <button 
                  onClick={() => setActiveTab("player")}
                  className={`py-2 px-4 font-medium text-sm rounded-t ${
                    activeTab === "player" ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                  Player Analytics
                </button>
              </nav>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              {activeTab === "general" && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Economic Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Gini Coefficient Over Time</h4>
                      {renderGiniChart()}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Current Class Distribution</h4>
                      {renderClassPieChart()}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "classes" && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Social Class Evolution</h3>
                  {renderClassDistributionChart()}
                </div>
              )}
              
              {activeTab === "prices" && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Product Price Trends</h3>
                  {renderProductPricesChart()}
                </div>
              )}
              
              {activeTab === "player" && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Player Capital History</h3>
                  <div className="mb-2">
                    <select 
                      className="p-2 border rounded"
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const player = players.find(p => p.id === selectedId);
                        setSelectedPlayer(player);
                      }}
                      value={selectedPlayer ? selectedPlayer.id : ''}
                    >
                      <option value="">Select a player...</option>
                      {players.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.level})</option>
                      ))}
                    </select>
                  </div>
                  {renderPlayerCapitalChart(selectedPlayer)}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Player Lists Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Top 5 Wealthiest</h3>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              {stats.topRichest.map((player) => (
                <div 
                  key={player.id} 
                  className="mb-2 pb-2 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePlayerSelection(player)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">{player.name}</h4>
                    <span className={capitalColor(player.level)}>
                      {player.capital.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={
                      player.strategy === "Aggressive" ? "text-orange-600" :
                      player.strategy === "Speculative" ? "text-pink-600" :
                      player.strategy === "Risky" ? "text-yellow-600" :
                      player.strategy === "Innovative" ? "text-purple-600" :
                      player.strategy === "Technological" ? "text-teal-600" :
                      player.strategy === "Balanced" ? "text-blue-600" : "text-gray-600"
                    }>
                      {player.strategy}
                    </span>
                    <span>Inventory: {player.inventoryValue.toLocaleString()}</span>
                  </div>
                  {player.specialization && (
                    <div className="text-xs text-gray-600">
                      Specialization: {player.specialization}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2">Judicial System (Offenders)</h3>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              {stats.penalizedPlayers.length > 0 ? stats.penalizedPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="mb-2 pb-2 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePlayerSelection(player)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">{player.name}</h4>
                    <div>
                      {player.specialStatus && (
                        <span className={statusColor(player.specialStatus)}>
                          {player.specialStatus}
                        </span>
                      )}
                      {player.penaltyTime > 0 && (
                        <span className="bg-orange-100 text-orange-800 ml-2 px-2 py-1 rounded">
                          {player.penaltyTime} turns
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Manipulation Points: {player.manipulationPoints}</span>
                    <span>Offenses: {player.imprisonmentRecord}</span>
                    <span className={capitalColor(player.level)}>
                      {player.capital.toLocaleString()}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 italic">No offenders currently in the system</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Your Player Panel */}
        {stats.player && (
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Your Player</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-xl">{stats.player.name}</h4>
                <div className="flex items-center">
                  {stats.player.specialStatus && (
                    <span className={`mr-3 ${statusColor(stats.player.specialStatus)}`}>
                      {stats.player.specialStatus}
                    </span>
                  )}
                  <span className={`${capitalColor(stats.player.level)} text-lg`}>
                    {stats.player.level}: {stats.player.capital.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-gray-600 text-sm">Strategy</p>
                  <p className="font-bold">{stats.player.strategy}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Inventory Value</p>
                  <p className="font-bold">{stats.player.inventoryValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Robin Hood Effect</p>
                  <p className={`font-bold ${stats.player.robinHoodPoints > 0 ? "text-green-600" : stats.player.robinHoodPoints < 0 ? "text-red-600" : ""}`}>
                    {stats.player.robinHoodPoints > 0 ? "+" : ""}{stats.player.robinHoodPoints.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Cycle</p>
                  <p className="font-bold">{stats.player.cycle}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-600 text-sm mb-1">Capital History</p>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.player.capitalHistory.map((value, index) => ({ turn: index, value }))}>
                      <Line type="monotone" dataKey="value" stroke="#3182ce" dot={false} />
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={
                  stats.player.strategy === "Aggressive" ? "text-orange-600" :
                  stats.player.strategy === "Speculative" ? "text-pink-600" :
                  stats.player.strategy === "Risky" ? "text-yellow-600" :
                  stats.player.strategy === "Innovative" ? "text-purple-600" :
                  stats.player.strategy === "Technological" ? "text-teal-600" :
                  stats.player.strategy === "Balanced" ? "text-blue-600" : "text-gray-600"
                }>
                  Strategy: <span className="font-bold">{stats.player.strategy}</span>
                </span>
                <button 
                  onClick={() => changeStrategy(stats.player.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Change Strategy
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* System Messages */}
        <div>
          <h3 className="font-bold text-lg mb-2">System Messages</h3>
          <div className="bg-white p-3 rounded-lg shadow-sm h-40 overflow-y-auto">
            {messages.map((message, index) => (
              <p key={index} className={`mb-1 text-sm ${
                    message.category === "warning" ? "text-red-600" :
                    message.category === "event" ? "text-purple-600" :
                    message.category === "market" ? "text-green-600" :
                    message.category === "status" ? "text-blue-600" :
                    message.category === "player" ? "text-yellow-600" : ""
                }`}>
                {message.text}
              </p>
            ))}
          </div>
        </div>
      </div>
      
      {/* System Description */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-2">Enhanced System Description</h3>
        <p className="mb-2">This advanced simulation models a dynamically balanced economy with cyclical capital movement. The system includes realistic supply and demand mechanics, a comprehensive judicial system for manipulation prevention, and sophisticated market events with lasting effects.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-bold mb-1">Advanced Strategies:</h4>
            <ul className="list-disc pl-5">
              <li><span className="font-bold text-blue-600">Balanced:</span> Medium risk, stable returns</li>
              <li><span className="font-bold text-yellow-600">Risky:</span> High volatility with strong upside potential</li>
              <li><span className="font-bold text-gray-600">Conservative:</span> Minimal risk with limited growth</li>
              <li><span className="font-bold text-orange-600">Aggressive:</span> Maximum volatility with highest potential</li>
              <li><span className="font-bold text-purple-600">Innovative:</span> Benefits from technological advancements</li>
              <li><span className="font-bold text-teal-600">Technological:</span> Specializes in tech market opportunities</li>
              <li><span className="font-bold text-pink-600">Speculative:</span> Profits from market bubbles and crashes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">Social Classes:</h4>
            <ul className="list-disc pl-5">
              <li><span className="font-bold text-purple-600">Elite:</span> Capital > {parameters.eliteLimit} units (Highest tax rate)</li>
              <li><span className="font-bold text-green-600">Rich:</span> Capital > {parameters.wealthLimit} units</li>
              <li><span className="font-bold text-teal-600">Upper Middle:</span> Capital > {parameters.upperMiddleLimit} units</li>
              <li><span className="font-bold text-blue-600">Middle:</span> Capital > {parameters.middleLimit} units</li>
              <li><span className="font-bold text-yellow-600">Lower Middle:</span> Capital > {parameters.lowerMiddleLimit} units</li>
              <li><span className="font-bold text-red-600">Poor:</span> Capital > {parameters.lowerMiddleLimit} units</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-bold mb-1">Enhanced Robin Hood Model:</h4>
          <p>This progressive redistribution system applies different tax rates based on wealth levels. Elite players are taxed at {parameters.eliteRobinHoodRate * 100}%, while Rich players are taxed at {parameters.robinHoodRate * 100}%. The collected funds are distributed primarily to Poor players, with Lower Middle class receiving partial benefits.</p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-bold mb-1">Advanced Judicial System:</h4>
          <p>The anti-manipulation system now includes three tiers of enforcement:</p>
          <ul className="list-disc pl-5">
            <li><span className="font-semibold">Monitoring:</span> Players showing suspicious activity gain manipulation points</li>
            <li><span className="font-semibold">Watchlist:</span> After reaching {parameters.manipulationThreshold} points, players receive penalties and are added to a watchlist</li>
            <li><span className="font-semibold">Imprisonment:</span> Repeat offenders with {parameters.imprisonmentThreshold}+ violations receive longer penalties and larger capital fines</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h4 className="font-bold mb-1">Market Events System:</h4>
          <p>Market events now have lasting effects that persist for multiple turns. They target specific player categories and product types, providing a more realistic economic simulation. Events can affect supply, demand, and prices of products while also impacting player strategies differently.</p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-bold mb-1">Auto-Bailout System:</h4>
          <p>When enabled, the system provides financial assistance to players in poverty when the Poor class exceeds {parameters.bailoutThreshold}% of the population, preventing extreme inequality.</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEconomySystem;