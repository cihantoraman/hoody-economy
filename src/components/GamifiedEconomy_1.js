import React, { useState, useEffect } from 'react';

const GamifiedEconomy = () => {
    // Products list
    const [products, setProducts] = useState([
        { id: 1, name: "Bread", basePrice: 10, price: 10, demand: 0.8, supply: 0.7 },
        { id: 2, name: "Water", basePrice: 5, price: 5, demand: 0.9, supply: 0.9 },
        { id: 3, name: "Housing", basePrice: 500, price: 500, demand: 0.6, supply: 0.5 },
        { id: 4, name: "Electronics", basePrice: 200, price: 200, demand: 0.5, supply: 0.6 },
        { id: 5, name: "Healthcare", basePrice: 150, price: 150, demand: 0.7, supply: 0.6 },
        { id: 6, name: "Education", basePrice: 300, price: 300, demand: 0.6, supply: 0.5 },
        { id: 7, name: "Transportation", basePrice: 100, price: 100, demand: 0.7, supply: 0.7 },
        { id: 8, name: "Energy", basePrice: 80, price: 80, demand: 0.8, supply: 0.6 },
        { id: 9, name: "Software", basePrice: 250, price: 250, demand: 0.5, supply: 0.7 },
        { id: 10, name: "Agricultural Products", basePrice: 50, price: 50, demand: 0.6, supply: 0.8 }
    ]);

    // Update wealth level function
    const updateLevel = (capital) => {
        if (capital >= 2000) return "Rich";
        if (capital <= 800) return "Poor";
        return "Middle";
    };

    // Create 100 players function
    const createPlayers = () => {
        const strategies = ["Balanced", "Risky", "Conservative", "Aggressive", "Innovative"];
        const players = [];
        for (let i = 1; i <= 100; i++) {
            // Majority in middle class, with fewer rich and poor
            let capital;
            if (i <= 10) {
                capital = 2000 + Math.floor(Math.random() * 3000); // Rich players
            } else if (i > 80) {
                capital = 300 + Math.floor(Math.random() * 500); // Poor players
            } else {
                capital = 800 + Math.floor(Math.random() * 1200); // Middle class
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
                robinHoodPoints: 0,
                inventory: products.map(product => ({
                    productId: product.id,
                    quantity: Math.floor(Math.random() * 5)
                }))
            };
            players.push(player);
        }
        return players;
    };

    // Players
    const [players, setPlayers] = useState(createPlayers());

    // System parameters
    const [parameters, setParameters] = useState({
        transformationRate: 0.2,    // Capital transformation rate
        balancingFactor: 0.15,      // Balancing factor
        wealthLimit: 2000,          // Wealth limit
        povertyLimit: 800,          // Poverty limit
        cycleTime: 3,               // Cycle time (seconds)
        active: false,              // Is simulation active?
        robinHoodModeActive: false, // Robin Hood mode
        robinHoodRate: 0.1,         // Rate to take from rich
        manipulationThreshold: 3,   // Manipulation detection threshold
        penaltyDuration: 5          // Manipulation penalty duration (turns)
    });

    // Turn count
    const [turnCount, setTurnCount] = useState(1);

    // Game messages
    const [messages, setMessages] = useState([
        "Enhanced Gamified Economy System initialized.",
        "100 players, 10 products, and manipulation countermeasures added.",
        "Click 'Start' to begin the simulation."
    ]);

    // Market events
    const marketEvents = [
        { event: "Economic crisis", effectCapital: -0.2, effectProduct: { id: 0, priceChange: 0.3 }, target: "Rich" },
        { event: "Technological breakthrough", effectCapital: 0.15, effectProduct: { id: 9, priceChange: -0.2 }, target: "Everyone" },
        { event: "Tax reform", effectCapital: -0.1, effectProduct: { id: 0, priceChange: 0 }, target: "Rich" },
        { event: "Social aid program", effectCapital: 0.2, effectProduct: { id: 0, priceChange: 0 }, target: "Poor" },
        { event: "Natural disaster", effectCapital: -0.15, effectProduct: { id: 3, priceChange: 0.25 }, target: "Everyone" },
        { event: "Political instability", effectCapital: -0.1, effectProduct: { id: 7, priceChange: 0.15 }, target: "Everyone" },
        { event: "Innovation breakthrough", effectCapital: 0.2, effectProduct: { id: 8, priceChange: -0.1 }, target: "Innovative" },
        { event: "Agricultural reform", effectCapital: 0.1, effectProduct: { id: 10, priceChange: -0.2 }, target: "Poor" },
        { event: "Health crisis", effectCapital: -0.1, effectProduct: { id: 5, priceChange: 0.3 }, target: "Everyone" },
        { event: "Education subsidy", effectCapital: 0.1, effectProduct: { id: 6, priceChange: -0.1 }, target: "Poor" }
    ];

    // Active market event
    const [activeEvent, setActiveEvent] = useState(null);

    // Add new message
    const addMessage = (message) => {
        setMessages(previousMessages => [message, ...previousMessages.slice(0, 9)]);
    };

    // Random market event
    const randomEvent = () => {
        if (Math.random() > 0.7) { // 30% chance of event occurring
            const event = marketEvents[Math.floor(Math.random() * marketEvents.length)];
            setActiveEvent(event);
            addMessage(`Market Event: ${event.event} (Capital Effect: ${event.effectCapital > 0 ? '+' : ''}${Math.round(event.effectCapital * 100)}%, Target: ${event.target})`);

            // Update product prices
            if (event.effectProduct.id !== 0) {
                setProducts(previousProducts => {
                    return previousProducts.map(product => {
                        if (product.id === event.effectProduct.id) {
                            const newPrice = Math.round(product.price * (1 + event.effectProduct.priceChange));
                            addMessage(`"${product.name}" price ${product.price > newPrice ? "decreased" : "increased"} from ${product.price} to ${newPrice}`);
                            return {...product, price: newPrice};
                        }
                        return product;
                    });
                });
            }

            return event;
        }
        return null;
    };

    // Manipulation check
    const manipulationCheck = () => {
        setPlayers(previousPlayers => {
            const newPlayers = [...previousPlayers];

            // Random players try to manipulate
            if (turnCount % 3 === 0) {
                const manipulationCandidates = newPlayers.filter(p => p.penaltyTime === 0 && Math.random() > 0.9);

                manipulationCandidates.forEach(player => {
                    const manipulationSeverity = Math.random() * 0.4 + 0.1; // 10%-50% range
                    const detectionChance = manipulationSeverity * 0.7; // Higher severity increases detection chance

                    if (Math.random() < detectionChance) {
                        // Caught
                        const playerIndex = newPlayers.findIndex(p => p.id === player.id);
                        newPlayers[playerIndex].manipulationPoints += 1;

                        if (newPlayers[playerIndex].manipulationPoints >= parameters.manipulationThreshold) {
                            // Apply penalty
                            newPlayers[playerIndex].penaltyTime = parameters.penaltyDuration;
                            newPlayers[playerIndex].capital = Math.round(newPlayers[playerIndex].capital * 0.8); // 20% capital loss
                            addMessage(`${player.name} was caught trying to manipulate the system! Penalized for ${parameters.penaltyDuration} turns.`);
                        } else {
                            addMessage(`${player.name} shows suspicious behavior. System is monitoring...`);
                        }
                    } else {
                        // Manipulation successful (not detected)
                        const playerIndex = newPlayers.findIndex(p => p.id === player.id);
                        newPlayers[playerIndex].capital = Math.round(newPlayers[playerIndex].capital * (1 + manipulationSeverity));
                    }
                });
            }

            // Reduce penalty time
            return newPlayers.map(player => {
                if (player.penaltyTime > 0) {
                    return {...player, penaltyTime: player.penaltyTime - 1};
                }
                return player;
            });
        });
    };

    // Robin Hood mechanism
    const robinHoodMechanism = () => {
        if (!parameters.robinHoodModeActive) return;

        const richPlayers = players.filter(p => p.level === "Rich" && p.penaltyTime === 0);
        const poorPlayers = players.filter(p => p.level === "Poor" && p.penaltyTime === 0);

        if (richPlayers.length === 0 || poorPlayers.length === 0) return;

        let totalTransfer = 0;

        // Collect from rich
        const newPlayers = [...players];
        richPlayers.forEach(rich => {
            const index = newPlayers.findIndex(p => p.id === rich.id);
            const transfer = Math.round(rich.capital * parameters.robinHoodRate);
            newPlayers[index].capital -= transfer;
            newPlayers[index].robinHoodPoints -= transfer;
            totalTransfer += transfer;
        });

        // Distribute to poor
        const perPersonTransfer = Math.floor(totalTransfer / poorPlayers.length);
        poorPlayers.forEach(poor => {
            const index = newPlayers.findIndex(p => p.id === poor.id);
            newPlayers[index].capital += perPersonTransfer;
            newPlayers[index].robinHoodPoints += perPersonTransfer;
        });

        setPlayers(newPlayers);
        addMessage(`Robin Hood mechanism activated: Transferred ${totalTransfer} units from ${richPlayers.length} rich to ${poorPlayers.length} poor players.`);
    };

    // Update product prices
    const updateProductPrices = () => {
        setProducts(previousProducts => {
            return previousProducts.map(product => {
                // Supply-demand balance with 5%-10% random price fluctuation
                const supplyDemandEffect = (product.demand - product.supply) * 0.1;
                const randomFluctuation = (Math.random() - 0.5) * 0.05;
                const changeRate = supplyDemandEffect + randomFluctuation;

                // Prevent sudden price changes
                const maxChange = 0.15;
                const limitedChange = Math.max(Math.min(changeRate, maxChange), -maxChange);

                // Calculate new price
                let newPrice = Math.round(product.price * (1 + limitedChange));

                // Prevent falling too far below or above base price
                const lowerLimit = product.basePrice * 0.5;
                const upperLimit = product.basePrice * 2;
                newPrice = Math.max(Math.min(newPrice, upperLimit), lowerLimit);

                // Report significant price changes
                if (Math.abs(newPrice - product.price) / product.price > 0.1) {
                    addMessage(`"${product.name}" price ${newPrice > product.price ? "increased" : "decreased"} from ${product.price} to ${newPrice}`);
                }

                // Update supply-demand balances
                const newDemand = Math.max(Math.min(product.demand + (Math.random() - 0.5) * 0.1, 1), 0.1);
                const newSupply = Math.max(Math.min(product.supply + (Math.random() - 0.5) * 0.1, 1), 0.1);

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

    // Trade simulation
    const tradeSimulation = () => {
        // Players buy and sell products
        setPlayers(previousPlayers => {
            const newPlayers = [...previousPlayers];

            newPlayers.forEach((player, index) => {
                if (player.penaltyTime > 0) return; // Penalized players cannot trade

                // Trading behavior based on strategy
                const tradeChance =
                    player.strategy === "Aggressive" ? 0.7 :
                        player.strategy === "Risky" ? 0.6 :
                            player.strategy === "Innovative" ? 0.5 :
                                player.strategy === "Balanced" ? 0.4 : 0.3;

                if (Math.random() < tradeChance) {
                    // Select random product
                    const productIndex = Math.floor(Math.random() * products.length);
                    const product = products[productIndex];

                    // Buy or sell decision
                    const makePurchase = Math.random() > 0.5;

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

                        // Increase demand
                        const productsCopy = [...products];
                        productsCopy[productIndex].demand = Math.min(productsCopy[productIndex].demand + 0.01, 1);
                        setProducts(productsCopy);

                    } else if (!makePurchase) {
                        // Product sale
                        const inventoryIndex = newPlayers[index].inventory.findIndex(e => e.productId === product.id && e.quantity > 0);

                        if (inventoryIndex !== -1) {
                            newPlayers[index].inventory[inventoryIndex].quantity -= 1;
                            newPlayers[index].capital += product.price;
                            newPlayers[index].inventoryValue -= product.price;

                            // Increase supply
                            const productsCopy = [...products];
                            productsCopy[productIndex].supply = Math.min(productsCopy[productIndex].supply + 0.01, 1);
                            setProducts(productsCopy);
                        }
                    }
                }
            });

            return newPlayers;
        });
    };

    // Capital transformation
    const capitalTransformation = () => {
        const event = randomEvent();

        // Manipulation check
        manipulationCheck();

        // Update product values
        updateProductPrices();

        // Trade simulation
        tradeSimulation();

        // Update inventory values
        updateInventoryValues();

        // Robin Hood mechanism
        if (turnCount % 5 === 0) {
            robinHoodMechanism();
        }

        setPlayers(previousPlayers => {
            return previousPlayers.map(player => {
                if (player.penaltyTime > 0) {
                    // Penalized players
                    return {...player};
                }

                let newCapital = player.capital;

                // Base change based on strategy
                const strategyFactor =
                    player.strategy === "Aggressive" ? (Math.random() > 0.5 ? 0.5 : -0.3) :
                        player.strategy === "Risky" ? (Math.random() > 0.5 ? 0.3 : -0.2) :
                            player.strategy === "Innovative" ? (Math.random() > 0.6 ? 0.4 : -0.2) :
                                player.strategy === "Balanced" ? (Math.random() > 0.5 ? 0.15 : -0.1) :
                                    (Math.random() > 0.5 ? 0.1 : -0.05); // Conservative

                // Balancing based on level
                const balancingFactor =
                    player.level === "Rich" ? -parameters.balancingFactor :
                        player.level === "Poor" ? parameters.balancingFactor : 0;

                // Market event effect
                let eventEffect = 0;
                if (event) {
                    if (event.target === "Everyone" ||
                        event.target === player.level ||
                        event.target === player.strategy) {
                        eventEffect = event.effectCapital;
                    }
                }

                // Inventory effect
                const inventoryEffect = player.inventoryValue > 0 ?
                    Math.min(player.inventoryValue * 0.01 / player.capital, 0.05) : 0;

                // Total change rate
                const changeRate = parameters.transformationRate * strategyFactor +
                    balancingFactor + eventEffect + inventoryEffect;

                // Calculate new capital
                newCapital = Math.max(100, Math.round(player.capital * (1 + changeRate)));

                // Update level
                const newLevel = updateLevel(newCapital);

                // Level change message
                if (newLevel !== player.level && (player.name === "Player" || Math.random() > 0.9)) {
                    addMessage(`${player.name} has ${newLevel === "Rich" ? "risen" : "fallen"} to ${newLevel} level!`);
                }

                return {
                    ...player,
                    capital: newCapital,
                    level: newLevel,
                    cycle: player.cycle + 1
                };
            });
        });

        setTurnCount(previousTurn => previousTurn + 1);
        if (turnCount % 10 === 0) {
            addMessage(`Turn ${turnCount} completed. Economic cycle continues.`);
        }
    };

    // Start/stop simulation
    const simulationToggle = () => {
        setParameters({...parameters, active: !parameters.active});
        if (!parameters.active) {
            addMessage("Simulation started. Capital transformations active.");
        } else {
            addMessage("Simulation stopped.");
        }
    };

    // Toggle Robin Hood mode
    const robinHoodToggle = () => {
        setParameters({...parameters, robinHoodModeActive: !parameters.robinHoodModeActive});
        if (!parameters.robinHoodModeActive) {
            addMessage("Robin Hood mode activated. Wealth will be redistributed from rich to poor.");
        } else {
            addMessage("Robin Hood mode deactivated.");
        }
    };

    // Change strategy
    const changeStrategy = (id) => {
        setPlayers(previousPlayers => {
            return previousPlayers.map(player => {
                if (player.id === id) {
                    const strategies = ["Balanced", "Risky", "Conservative", "Aggressive", "Innovative"];
                    const currentIndex = strategies.indexOf(player.strategy);
                    const newIndex = (currentIndex + 1) % strategies.length;
                    const newStrategy = strategies[newIndex];

                    addMessage(`${player.name} changed strategy to ${newStrategy}.`);
                    return {...player, strategy: newStrategy};
                }
                return player;
            });
        });
    };

    // Cyclic timer
    useEffect(() => {
        let timer;
        if (parameters.active) {
            timer = setInterval(() => {
                capitalTransformation();
            }, parameters.cycleTime * 1000);
        }
        return () => clearInterval(timer);
    }, [parameters.active, turnCount]);

    // Calculate economic statistics
    const economicStatistics = () => {
        const totalCapital = players.reduce((total, player) => total + player.capital, 0);
        const totalInventoryValue = players.reduce((total, player) => total + player.inventoryValue, 0);
        const avgCapital = Math.round(totalCapital / players.length);
        const richCount = players.filter(p => p.level === "Rich").length;
        const poorCount = players.filter(p => p.level === "Poor").length;
        const penalizedCount = players.filter(p => p.penaltyTime > 0).length;

        // Get top 5 richest
        const topRichest = [...players]
            .sort((a, b) => b.capital - a.capital)
            .slice(0, 5);

        // Get top 5 poorest
        const topPoorest = [...players]
            .sort((a, b) => a.capital - b.capital)
            .slice(0, 5);

        // Get penalized players
        const penalizedPlayers = players.filter(p => p.penaltyTime > 0);

        // Find the player (id=50)
        const player = players.find(p => p.name === "Player");

        // Calculate Gini coefficient (inequality index)
        const giniCoefficient = calculateGini();

        return {
            totalCapital,
            totalInventoryValue,
            avgCapital,
            richCount,
            poorCount,
            penalizedCount,
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

        const total = sortedCapitals.reduce((a, b) => a + b, 0);
        let b = 0;

        for (let i = 0; i < n; i++) {
            b += (n - i) * sortedCapitals[i];
        }

        const gini = (n + 1 - 2 * (b / total)) / n;
        return Math.round(gini * 100) / 100;
    };

    const stats = economicStatistics();

    // Helper function for capital color
    const capitalColor = (level) => {
        switch (level) {
            case "Rich": return "text-green-600 font-bold";
            case "Middle": return "text-blue-600";
            case "Poor": return "text-red-600";
            default: return "";
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                <h1 className="text-2xl font-bold text-center mb-2">Gamified Economy System</h1>
                <h2 className="text-xl text-center mb-4">Cyclical Capital Model</h2>

                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm w-full md:w-1/4">
                        <h3 className="font-bold text-lg border-b pb-1 mb-2">Economic Statistics</h3>
                        <p>Turn: <span className="font-bold">{turnCount}</span></p>
                        <p>Total Capital: <span className="font-bold">{stats.totalCapital.toLocaleString()}</span></p>
                        <p>Average Capital: <span className="font-bold">{stats.avgCapital.toLocaleString()}</span></p>
                        <p>Gini Coefficient: <span className="font-bold">{stats.giniCoefficient}</span></p>
                        <p>Rich Count: <span className="font-bold text-green-600">{stats.richCount}</span></p>
                        <p>Poor Count: <span className="font-bold text-red-600">{stats.poorCount}</span></p>
                        <p>Penalized: <span className="font-bold text-orange-600">{stats.penalizedCount}</span></p>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={simulationToggle}
                            className={`px-4 py-2 rounded-lg font-bold w-full ${parameters.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                        >
                            {parameters.active ? 'Stop' : 'Start'}
                        </button>
                        <button
                            onClick={capitalTransformation}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold w-full"
                            disabled={parameters.active}
                        >
                            Manual Turn
                        </button>
                        <button
                            onClick={robinHoodToggle}
                            className={`px-4 py-2 rounded-lg font-bold w-full ${parameters.robinHoodModeActive ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white'}`}
                        >
                            {parameters.robinHoodModeActive ? 'Disable Robin Hood' : 'Enable Robin Hood'}
                        </button>
                    </div>

                    {activeEvent && (
                        <div className="bg-yellow-100 p-3 rounded-lg shadow-sm w-full md:w-1/4">
                            <h3 className="font-bold border-b pb-1 mb-1">Market Event</h3>
                            <p>{activeEvent.event}</p>
                            <p>Effect: <span className={activeEvent.effectCapital > 0 ? "text-green-600" : "text-red-600"}>
                {activeEvent.effectCapital > 0 ? '+' : ''}{Math.round(activeEvent.effectCapital * 100)}%
              </span></p>
                            <p>Target: {activeEvent.target}</p>
                        </div>
                    )}

                    <div className="bg-white p-3 rounded-lg shadow-sm w-full md:w-1/4">
                        <h3 className="font-bold text-lg border-b pb-1 mb-2">Products</h3>
                        <div className="h-40 overflow-y-auto">
                            {products.map((product) => (
                                <div key={product.id} className="mb-1 border-b pb-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>{product.name}</span>
                                        <span className="font-bold">{product.price}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span>Demand: {Math.round(product.demand * 100)}%</span>
                                        <span>Supply: {Math.round(product.supply * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Top 5 Richest</h3>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                            {stats.topRichest.map((player) => (
                                <div key={player.id} className="mb-2 pb-2 border-b">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold">{player.name}</h4>
                                        <span className={capitalColor(player.level)}>
                      {player.capital.toLocaleString()}
                    </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                    <span className={player.strategy === "Aggressive" ? "text-orange-600" :
                        player.strategy === "Risky" ? "text-yellow-600" :
                            player.strategy === "Innovative" ? "text-purple-600" :
                                player.strategy === "Balanced" ? "text-blue-600" : "text-gray-600"}>
                    </span>
                                        <span>Inventory: {player.inventoryValue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">Penalized Players</h3>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                            {stats.penalizedPlayers.length > 0 ? stats.penalizedPlayers.map((player) => (
                                <div key={player.id} className="mb-2 pb-2 border-b">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold">{player.name}</h4>
                                        <span className="text-red-600">
                      Penalty: {player.penaltyTime} turns
                    </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Manipulation Points: {player.manipulationPoints}</span>
                                        <span>Capital: {player.capital.toLocaleString()}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 italic">No penalized players</p>
                            )}
                        </div>
                    </div>
                </div>

                {stats.player && (
                    <div className="mb-4">
                        <h3 className="font-bold text-lg mb-2">Your Player</h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-300">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-xl">{stats.player.name}</h4>
                                <span className={`${capitalColor(stats.player.level)} text-lg`}>
                  {stats.player.level}: {stats.player.capital.toLocaleString()}
                </span>
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
                                        {stats.player.robinHoodPoints > 0 ? "+" : ""}{stats.player.robinHoodPoints}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Cycle</p>
                                    <p className="font-bold">{stats.player.cycle}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                <span className={stats.player.strategy === "Aggressive" ? "text-orange-600" :
                    stats.player.strategy === "Risky" ? "text-yellow-600" :
                        stats.player.strategy === "Innovative" ? "text-purple-600" :
                            stats.player.strategy === "Balanced" ? "text-blue-600" : "text-gray-600"}>
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

                <div>
                    <h3 className="font-bold text-lg mb-2">System Messages</h3>
                    <div className="bg-white p-3 rounded-lg shadow-sm h-40 overflow-y-auto">
                        {messages.map((message, index) => (
                            <p key={index} className="mb-1 text-sm">{message}</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2">System Description</h3>
                <p className="mb-2">This simulation models a gamified economy system where capital cycles between players. As players grow richer, they gradually become poorer, while poor players gradually become wealthier.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <h4 className="font-bold mb-1">Strategies:</h4>
                        <ul className="list-disc pl-5">
                            <li><span className="font-bold text-blue-600">Balanced:</span> Medium risk, medium return/loss</li>
                            <li><span className="font-bold text-yellow-600">Risky:</span> High risk, high return/loss potential</li>
                            <li><span className="font-bold text-gray-600">Conservative:</span> Low risk, low return/loss</li>
                            <li><span className="font-bold text-orange-600">Aggressive:</span> Very high risk, highest return/loss potential</li>
                            <li><span className="font-bold text-purple-600">Innovative:</span> Moderate-high risk, good for technology events</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-1">Economic Levels:</h4>
                        <ul className="list-disc pl-5">
                            <li><span className="font-bold text-green-600">Rich:</span> Capital > {parameters.wealthLimit} units (Rich gradually lose capital)</li>
                            <li><span className="font-bold text-blue-600">Middle:</span> Capital between {parameters.povertyLimit} - {parameters.wealthLimit} units</li>
                            <li><span className="font-bold text-red-600">Poor:</span> Capital  {parameters.povertyLimit} units (Poor gradually gain capital)</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="font-bold mb-1">Robin Hood Model:</h4>
                    <p>The Robin Hood model is an economic redistribution mechanism that taxes the wealthy to benefit the poor. When enabled in this simulation, it takes {parameters.robinHoodRate * 100}% of the rich players' capital every 5 turns and distributes it evenly among poor players.</p>
                    <p>In economic literature, Robin Hood mechanisms are forms of progressive taxation and wealth redistribution policies designed to reduce inequality. They're named after the legendary outlaw who "stole from the rich to give to the poor."</p>
                </div>

                <div className="mt-4">
                    <h4 className="font-bold mb-1">Anti-Manipulation System:</h4>
                    <p>The system actively monitors for manipulation attempts. Players who try to manipulate the economy will accumulate manipulation points. Once they reach the threshold of {parameters.manipulationThreshold} points, they'll be penalized for {parameters.penaltyDuration} turns, during which they cannot trade and lose 20% of their capital.</p>
                </div>
            </div>
        </div>
    );
};

export default GamifiedEconomy;