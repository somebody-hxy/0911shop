/*
Navicat MySQL Data Transfer

Source Server         : 123
Source Server Version : 50547
Source Host           : localhost:3306
Source Database       : shop

Target Server Type    : MYSQL
Target Server Version : 50547
File Encoding         : 65001

Date: 2017-09-10 23:48:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for shop_admin
-- ----------------------------
DROP TABLE IF EXISTS `shop_admin`;
CREATE TABLE `shop_admin` (
  `au_id` int(11) NOT NULL AUTO_INCREMENT,
  `au_phone` varchar(200) NOT NULL DEFAULT '',
  `au_pwd` varchar(200) NOT NULL DEFAULT '',
  `au_name` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`au_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_admin
-- ----------------------------

-- ----------------------------
-- Table structure for shop_category
-- ----------------------------
DROP TABLE IF EXISTS `shop_category`;
CREATE TABLE `shop_category` (
  `c_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_name` varchar(255) DEFAULT NULL COMMENT '分类名称',
  `c_parent_id` int(10) unsigned DEFAULT NULL COMMENT '父ID',
  `c_del` smallint(4) unsigned DEFAULT NULL,
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_category
-- ----------------------------
INSERT INTO `shop_category` VALUES ('1', '美甲工具', '0', '0');
INSERT INTO `shop_category` VALUES ('2', '指甲油', '0', '0');
INSERT INTO `shop_category` VALUES ('3', '卸甲水', '6', '0');
INSERT INTO `shop_category` VALUES ('6', '345', '0', '0');

-- ----------------------------
-- Table structure for shop_company
-- ----------------------------
DROP TABLE IF EXISTS `shop_company`;
CREATE TABLE `shop_company` (
  `co_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `co_name` varchar(255) DEFAULT NULL COMMENT '单位名称',
  `co_people` varchar(255) DEFAULT NULL COMMENT '单位负责人',
  `co_tel` varchar(12) DEFAULT NULL COMMENT '负责人电话',
  `co_address` varchar(255) DEFAULT NULL COMMENT '单位地址',
  `co_status` smallint(4) unsigned DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`co_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_company
-- ----------------------------
INSERT INTO `shop_company` VALUES ('1', '互联互加', '冉小龙', '17088178934', '成都', '1');

-- ----------------------------
-- Table structure for shop_order
-- ----------------------------
DROP TABLE IF EXISTS `shop_order`;
CREATE TABLE `shop_order` (
  `o_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `o_number` varchar(20) DEFAULT NULL COMMENT '订单号',
  `o_color` varchar(255) DEFAULT NULL COMMENT '商品颜色',
  `o_company` varchar(255) DEFAULT NULL COMMENT '公司单位名称',
  `o_total` int(10) unsigned DEFAULT NULL,
  `o_name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `o_size` varchar(255) DEFAULT NULL COMMENT '商品尺码',
  `o_tel` varchar(255) DEFAULT NULL COMMENT '电话',
  `o_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `o_create_at` int(10) unsigned DEFAULT NULL COMMENT '创建时间',
  `status` smallint(4) unsigned DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`o_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_order
-- ----------------------------
