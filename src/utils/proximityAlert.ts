import Ship from "../phaser/characters/Characters";

export default class ProximityAlertManager {
    private ship: Ship;
    private otherShips: { [userID: string]: Ship };

    constructor(ship: Ship, otherShips: { [userID: string]: Ship }) {
        this.ship = ship;
        this.otherShips = otherShips;
    }

    handleProximityAlerts(alerts: string[]) {
        const invalidAlerts: string[] = [];
        alerts.forEach((userID) => {
            const otherShip = this.otherShips[userID];
            if (!otherShip) {
                console.error(`Proximity alert for unknown user: ${userID}`);
                invalidAlerts.push(userID);
                return;
            }

            const dx = this.ship.x - otherShip.x;
            const dy = this.ship.y - otherShip.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared > 2500) {
                console.warn(`Invalid proximity alert: ${userID} is no longer nearby.`);
                invalidAlerts.push(userID);
                return;
            }

            console.log(`Proximity alert: You are near user ${userID}`);
        });

        if (invalidAlerts.length > 0) {
            console.warn(`Invalid proximity alerts detected for users: ${invalidAlerts.join(", ")}`);
        }
    }
}
