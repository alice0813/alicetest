// Description:
//   This is quick demo

function isGroup(userName) {
  return userName.startsWith("@@");
}

function getResponseBody(response) {
  return JSON.parse(response.getBody('utf-8'));
}

const wxUtils = {
  getNickName: function (robot, roomId, userId) {
    let groupInfo = robot.adapter.wxbot.groupInfo;
    let groupName = groupInfo[roomId];
    let groupMemberInfo = robot.adapter.wxbot.groupMemberInfo;
    let memberList = groupMemberInfo[roomId];
    let contactInfo = {};
    contactInfo["groupName"] = groupName;
    for (let member in memberList) {
      if (member == userId) {
        contactInfo["userName"] = memberList[member];
        return contactInfo;
      }
    }
    return contactInfo;
  },

  getUserId: function (robot, roomId, userName) {
    let groupMemberInfo = robot.adapter.wxbot.groupMemberInfo;
    this.getGroupContactList(robot);
    let memberList = groupMemberInfo[roomId];
    for (let member in memberList) {
      console.log(memberList[member]);
      if (memberList[member] == userName) {
        return member;
      }
    }
    return null;
  },

  getGroupContactList: function (robot) {
    let api = robot.adapter.wxbot.api;
    let contactRes = api.getContact();
    let jsonObject = getResponseBody(contactRes)
    let groupInfo = {};
    jsonObject.MemberList.forEach(function (member) {
      if (isGroup(member.UserName)) {
        groupInfo[member.UserName] = member;
      }
    })
    let batchContactRes = api.getBatchContact(groupInfo);
    jsonObject = getResponseBody(batchContactRes)
    jsonObject.ContactList.forEach(function (group) {
      groupInfo[group["UserName"]] = group.MemberList;
    })
    robot.adapter.wxbot.groupList = groupInfo;
  }
}

module.exports = wxUtils
