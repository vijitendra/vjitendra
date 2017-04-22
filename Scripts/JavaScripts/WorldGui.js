#pragma strict
var coinIcon : Texture2D;
var healthIcon : Texture2D;

function Start () {

}

function Update () {

}
function OnGUI()
{
var coinNumberName = PlayerCounters.coinCounter;
var coinName = coinNumberName.ToString();

var healthNumberName = PlayerCounters.playerHealth;
var healthName = healthNumberName.ToString();

GUI.Label(Rect(55,60,50,25),coinName);
GUI.Box(Rect(10,10,100,90), coinIcon);

GUI.Label(Rect(215,60,200,25), healthName);
GUI.Box(Rect(140,10,150,50), healthIcon);
}