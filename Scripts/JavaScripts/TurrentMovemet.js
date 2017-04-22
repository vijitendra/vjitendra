#pragma strict
var target : Transform;
var turret : Transform;
var damp = 1.0;
var Bullet : Transform;
var BulletSpawn : Transform;
var timer = 0.0;

function Start () {

}

function Update () {
var rotate = Quaternion.LookRotation(target.position - turret.position);
turret.rotation = Quaternion.Slerp(turret.rotation, rotate, Time.deltaTime * damp);

//turrent.transform.LookAt(target);

}
function OnTriggerStay (objectTriggered : Collider)
{
timer += Time.deltaTime;
if (objectTriggered.transform == target)
{
var rotate = Quaternion.LookRotation(target.position - turret.position);
turret.rotation = Quaternion.Slerp(turret.rotation, rotate, Time.deltaTime * damp);
if (timer>3.0)
{
Instantiate(Bullet , BulletSpawn.position, BulletSpawn.rotation);
timer = 0.0;
}
}
}