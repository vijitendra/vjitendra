#pragma strict
static var coinCounter = 0;
static var playerHealth = 5;


function Start () {
//Makes sure player has full health at start.
playerHealth = 5;
coinCounter = 0;

}

function Update () {
if (playerHealth <= 0)
{
Application.LoadLevel ("Game Over Scene");
}
if (coinCounter >=5)
{
Application.LoadLevel ("Win Scene");
} 

}
function OnCollisionEnter(collision : Collision)
{
if (collision.transform.name ==  ("Coin"))
{
coinCounter += 1;
}
else if (collision.transform.name == ("Enemy") && playerHealth > 0)
{
playerHealth -= 1;
}
}