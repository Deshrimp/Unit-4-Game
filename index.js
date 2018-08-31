"use strict"
import { character } from "./character.js"

var state
var player
var defender
var characters = []
var enemiesRemaining = $(".character").length - 1

function newGame() {
  state = "new game"
  player = undefined
  defender = undefined
  $("#battlemessage").html("")
  $(".character")
    .removeClass("player")
    .removeClass("defender")
    .show()
    .detach()
    .appendTo(".characters")
  //load characters into characters array from the html
  $(".character").each(function() {
    const index = $(this).data("id")
    const initialhp = $(this).data("initialhp")
    const name = $(this).attr("id")
    const attack = $(this).data("attack")
    //Create a new object for every character with these items
    characters[index] = new character(name, initialhp, attack)
    //Add Hitpoints to each characters picture
    $(this)
      .children(".hp")
      .text(`HP: ${initialhp}`)
    $(this)
      .children(".charactername")
      .text(`${name}`)
  })
}
newGame()

$(".character").on("click", function() {
  if (state === "new game") {
    //It creates a new function which is bound to the this in the current context
    //and then the () at the end calls the new function
    pickPlayer.bind(this)()
  } else if (state === "selecting enemy") {
    if (enemiesRemaining === 0) {
      state = "game won"
    } else {
      pickEnemy.bind(this)()
    }
  }
})

function pickPlayer() {
  player = characters[$(this).data("id")]
  $(this).appendTo("#currentPlayer")
  $(this).addClass("player")
  $(".character").each(function() {
    if (!$(this).hasClass("player")) {
      $(this).appendTo("#availableEnemies")
    }
  })

  state = "selecting enemy"
}
function pickEnemy() {
  defender = characters[$(this).data("id")]
  //ensure that player !== defender
  if (player === defender) {
    defender = undefined
    return
  } else {
    $(this).addClass("defender")
    $(this).appendTo("#currentDefender")

    $("#battle").removeClass("disabled")
    state = "battling"
  }
}

$("#battle").on("click", function() {
  if (state === "battling") {
    let defenderhp = defender.takeDamage(player.getAttack())

    $(".defender .hp").html(`<div class='hp'>HP: ${defenderhp}</div>`)
    if (defenderhp > 0) {
      let playerhp = player.takeDamage(defender.getAttack())
      if (playerhp > 0) {
        $("#battlemessage")
          .html(`You did <span id="playerdmg">${player.getAttack()}</span> damage to ${defender.getName()}. ${defender.getName()} did <span id="defenderdmg">${defender.getAttack()}</span>
          damage to you.`)
      } else {
        state = "game over"
        $("#battlemessage").html(
          `${defender.getName()} did <span id="defenderdmg">${defender.getAttack()}</span> damage to you. You are defeated. Game Over.`
        )
        $("#battle").addClass("disabled")
      }
      $(".player .hp").html(`<div class='hp'>HP: ${playerhp}</div>`)
    } else {
      $(".defender").hide()
      $(".defender").removeClass("defender")
      $("#battlemessage").html(
        `You did <span id="playerdmg">${player.getAttack()}</span> damage to ${defender.getName()}. You have won the battle with ${defender.getName()}`
      )
      enemiesRemaining--
      state = "selecting enemy"
    }
  }

  player.increaseAttack()
  if (enemiesRemaining === 0) {
    alert("You are the lord of the rings")
    newGame()
  }
})
