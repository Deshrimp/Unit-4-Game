class character {
  constructor(name, initialhp, attack) {
    this.name = name
    this.initialhp = initialhp
    this.hp = initialhp
    this.initialattack = attack
    this.attack = attack
  }

  getHP() {
    return this.hp
  }

  getAttack() {
    return this.attack
  }

  getName() {
    return this.name
  }

  // Does damage to character then returns the new value for hp
  takeDamage(damage) {
    this.hp -= damage
    return this.hp
  }

  increaseAttack() {
    this.attack += this.initialattack
  }
}
export { character }
