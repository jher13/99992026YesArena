begin;
create table arena_private.campaign_regions (region text primary key,ordinal integer unique not null,generation integer not null,badges text[] not null,coins integer not null,candy integer not null,master_candy integer not null);
insert into arena_private.campaign_regions values('Kanto',1,1,array['Kanto/Boulder','Kanto/Cascade','Kanto/Thunder','Kanto/Rainbow','Kanto/Soul','Kanto/Marsh','Kanto/Volcano','Kanto/Earth'],2000,1,2);
insert into arena_private.campaign_regions values('Johto',2,2,array['Johto/Zephyr','Johto/Hive','Johto/Plain','Johto/Fog','Johto/Storm','Johto/Mineral','Johto/Glacier','Johto/Rising'],3000,1,2);
insert into arena_private.campaign_regions values('Hoenn',3,3,array['Hoenn/Stone','Hoenn/Knuckle','Hoenn/Dynamo','Hoenn/Heat','Hoenn/Balance','Hoenn/Feather','Hoenn/Mind','Hoenn/Rain'],4500,1,2);
insert into arena_private.campaign_regions values('Sinnoh',4,4,array['Sinnoh/Coal','Sinnoh/Forest','Sinnoh/Cobble','Sinnoh/Fen','Sinnoh/Relic','Sinnoh/Mine','Sinnoh/Icicle','Sinnoh/Beacon'],6000,2,3);
insert into arena_private.campaign_regions values('Unova',5,5,array['Unova/Trio','Unova/Basic','Unova/Toxic','Unova/Insect','Unova/Bolt','Unova/Quake','Unova/Jet','Unova/Freeze','Unova/Legend','Unova/Wave'],8000,2,3);
insert into arena_private.campaign_regions values('Kalos',6,6,array['Kalos/Bug','Kalos/Cliff','Kalos/Rumble','Kalos/Plant','Kalos/Voltage','Kalos/Fairy','Kalos/Psychic','Kalos/Iceberg'],10000,2,3);
insert into arena_private.campaign_regions values('Galar',7,8,array['Galar/Grass','Galar/Water','Galar/Fire','Galar/Fighting','Galar/Ghost','Galar/Fairy','Galar/Rock','Galar/Ice','Galar/Dark','Galar/Dragon'],12500,3,4);
insert into arena_private.campaign_regions values('Paldea',8,9,array['Paldea/Bug','Paldea/Grass','Paldea/Electric','Paldea/Water','Paldea/Normal','Paldea/Ghost','Paldea/Psychic','Paldea/Ice'],15000,3,4);
create table arena_private.campaign_families (dex integer primary key references arena_private.market_species(dex),root integer not null,min_level integer not null,rare boolean not null);
insert into arena_private.campaign_families values
(1,1,1,false),
(2,1,16,false),
(3,1,32,false),
(4,4,1,false),
(5,4,16,false),
(6,4,36,false),
(7,7,1,false),
(8,7,16,false),
(9,7,36,false),
(10,10,1,false),
(11,10,7,false),
(12,10,10,false),
(13,13,1,false),
(14,13,7,false),
(15,13,10,false),
(16,16,1,false),
(17,16,18,false),
(18,16,36,false),
(19,19,1,false),
(20,19,20,false),
(21,21,1,false),
(22,21,20,false),
(23,23,1,false),
(24,23,22,false),
(25,172,20,false),
(26,172,35,false),
(27,27,1,false),
(28,27,22,false),
(29,29,1,false),
(30,29,16,false),
(31,29,35,false),
(32,32,1,false),
(33,32,16,false),
(34,32,35,false),
(35,173,20,false),
(36,173,35,false),
(37,37,1,false),
(38,37,20,false),
(39,174,20,false),
(40,174,35,false),
(41,41,1,false),
(42,41,22,false),
(43,43,1,false),
(44,43,21,false),
(45,43,35,false),
(46,46,1,false),
(47,46,24,false),
(48,48,1,false),
(49,48,31,false),
(50,50,1,false),
(51,50,26,false),
(52,52,1,false),
(53,52,28,false),
(54,54,1,false),
(55,54,33,false),
(56,56,1,false),
(57,56,28,false),
(58,58,1,false),
(59,58,20,false),
(60,60,1,false),
(61,60,25,false),
(62,60,35,false),
(63,63,1,false),
(64,63,16,false),
(65,63,35,false),
(66,66,1,false),
(67,66,28,false),
(68,66,35,false),
(69,69,1,false),
(70,69,21,false),
(71,69,35,false),
(72,72,1,false),
(73,72,30,false),
(74,74,1,false),
(75,74,25,false),
(76,74,35,false),
(77,77,1,false),
(78,77,40,false),
(79,79,1,false),
(80,79,37,false),
(81,81,1,false),
(82,81,30,false),
(83,83,1,false),
(84,84,1,false),
(85,84,31,false),
(86,86,1,false),
(87,86,34,false),
(88,88,1,false),
(89,88,38,false),
(90,90,1,false),
(91,90,20,false),
(92,92,1,false),
(93,92,25,false),
(94,92,35,false),
(95,95,1,false),
(96,96,1,false),
(97,96,26,false),
(98,98,1,false),
(99,98,28,false),
(100,100,1,false),
(101,100,30,false),
(102,102,1,false),
(103,102,20,false),
(104,104,1,false),
(105,104,28,false),
(106,236,20,false),
(107,236,20,false),
(108,108,1,false),
(109,109,1,false),
(110,109,35,false),
(111,111,1,false),
(112,111,42,false),
(113,440,20,false),
(114,114,1,false),
(115,115,1,false),
(116,116,1,false),
(117,116,32,false),
(118,118,1,false),
(119,118,33,false),
(120,120,1,false),
(121,120,20,false),
(122,439,20,false),
(123,123,1,false),
(124,238,30,false),
(125,239,30,false),
(126,240,30,false),
(127,127,1,false),
(128,128,1,false),
(129,129,1,false),
(130,129,20,false),
(131,131,1,false),
(132,132,1,false),
(133,133,1,false),
(134,133,20,false),
(135,133,20,false),
(136,133,20,false),
(137,137,1,false),
(138,138,1,false),
(139,138,40,false),
(140,140,1,false),
(141,140,40,false),
(142,142,1,false),
(143,446,20,false),
(144,144,1,true),
(145,145,1,true),
(146,146,1,true),
(147,147,1,false),
(148,147,30,false),
(149,147,55,false),
(150,150,1,true),
(151,151,1,true),
(152,152,1,false),
(153,152,16,false),
(154,152,32,false),
(155,155,1,false),
(156,155,14,false),
(157,155,36,false),
(158,158,1,false),
(159,158,18,false),
(160,158,30,false),
(161,161,1,false),
(162,161,15,false),
(163,163,1,false),
(164,163,20,false),
(165,165,1,false),
(166,165,18,false),
(167,167,1,false),
(168,167,22,false),
(169,41,35,false),
(170,170,1,false),
(171,170,27,false),
(172,172,1,false),
(173,173,1,false),
(174,174,1,false),
(175,175,1,false),
(176,175,20,false),
(177,177,1,false),
(178,177,25,false),
(179,179,1,false),
(180,179,15,false),
(181,179,30,false),
(182,43,35,false),
(183,298,20,false),
(184,298,20,false),
(185,438,20,false),
(186,60,35,false),
(187,187,1,false),
(188,187,18,false),
(189,187,27,false),
(190,190,1,false),
(191,191,1,false),
(192,191,20,false),
(193,193,1,false),
(194,194,1,false),
(195,194,20,false),
(196,133,20,false),
(197,133,20,false),
(198,198,1,false),
(199,79,20,false),
(200,200,1,false),
(201,201,1,false),
(202,360,15,false),
(203,203,1,false),
(204,204,1,false),
(205,204,31,false),
(206,206,1,false),
(207,207,1,false),
(208,95,20,false),
(209,209,1,false),
(210,209,23,false),
(211,211,1,false),
(212,123,20,false),
(213,213,1,false),
(214,214,1,false),
(215,215,1,false),
(216,216,1,false),
(217,216,30,false),
(218,218,1,false),
(219,218,38,false),
(220,220,1,false),
(221,220,33,false),
(222,222,1,false),
(223,223,1,false),
(224,223,25,false),
(225,225,1,false),
(226,458,20,false),
(227,227,1,false),
(228,228,1,false),
(229,228,24,false),
(230,116,35,false),
(231,231,1,false),
(232,231,25,false),
(233,137,20,false),
(234,234,1,false),
(235,235,1,false),
(236,236,1,false),
(237,236,20,false),
(238,238,1,false),
(239,239,1,false),
(240,240,1,false),
(241,241,1,false),
(242,440,35,false),
(243,243,1,true),
(244,244,1,true),
(245,245,1,true),
(246,246,1,false),
(247,246,30,false),
(248,246,55,false),
(249,249,1,true),
(250,250,1,true),
(251,251,1,true),
(252,252,1,false),
(253,252,16,false),
(254,252,36,false),
(255,255,1,false),
(256,255,16,false),
(257,255,36,false),
(258,258,1,false),
(259,258,16,false),
(260,258,36,false),
(261,261,1,false),
(262,261,18,false),
(263,263,1,false),
(264,263,20,false),
(265,265,1,false),
(266,265,20,false),
(267,265,20,false),
(268,265,20,false),
(269,265,20,false),
(270,270,1,false),
(271,270,14,false),
(272,270,35,false),
(273,273,1,false),
(274,273,14,false),
(275,273,35,false),
(276,276,1,false),
(277,276,22,false),
(278,278,1,false),
(279,278,25,false),
(280,280,1,false),
(281,280,20,false),
(282,280,30,false),
(283,283,1,false),
(284,283,22,false),
(285,285,1,false),
(286,285,23,false),
(287,287,1,false),
(288,287,18,false),
(289,287,36,false),
(290,290,1,false),
(291,290,20,false),
(292,290,20,false),
(293,293,1,false),
(294,293,20,false),
(295,293,40,false),
(296,296,1,false),
(297,296,24,false),
(298,298,1,false),
(299,299,1,false),
(300,300,1,false),
(301,300,20,false),
(302,302,1,false),
(303,303,1,false),
(304,304,1,false),
(305,304,32,false),
(306,304,42,false),
(307,307,1,false),
(308,307,37,false),
(309,309,1,false),
(310,309,26,false),
(311,311,1,false),
(312,312,1,false),
(313,313,1,false),
(314,314,1,false),
(315,406,20,false),
(316,316,1,false),
(317,316,26,false),
(318,318,1,false),
(319,318,30,false),
(320,320,1,false),
(321,320,40,false),
(322,322,1,false),
(323,322,33,false),
(324,324,1,false),
(325,325,1,false),
(326,325,32,false),
(327,327,1,false),
(328,328,1,false),
(329,328,35,false),
(330,328,45,false),
(331,331,1,false),
(332,331,32,false),
(333,333,1,false),
(334,333,35,false),
(335,335,1,false),
(336,336,1,false),
(337,337,1,false),
(338,338,1,false),
(339,339,1,false),
(340,339,30,false),
(341,341,1,false),
(342,341,30,false),
(343,343,1,false),
(344,343,36,false),
(345,345,1,false),
(346,345,40,false),
(347,347,1,false),
(348,347,40,false),
(349,349,1,false),
(350,349,20,false),
(351,351,1,false),
(352,352,1,false),
(353,353,1,false),
(354,353,37,false),
(355,355,1,false),
(356,355,37,false),
(357,357,1,false),
(358,433,20,false),
(359,359,1,false),
(360,360,1,false),
(361,361,1,false),
(362,361,42,false),
(363,363,1,false),
(364,363,32,false),
(365,363,44,false),
(366,366,1,false),
(367,366,20,false),
(368,366,20,false),
(369,369,1,false),
(370,370,1,false),
(371,371,1,false),
(372,371,30,false),
(373,371,50,false),
(374,374,1,false),
(375,374,20,false),
(376,374,45,false),
(377,377,1,true),
(378,378,1,true),
(379,379,1,true),
(380,380,1,true),
(381,381,1,true),
(382,382,1,true),
(383,383,1,true),
(384,384,1,true),
(385,385,1,true),
(386,386,1,true),
(387,387,1,false),
(388,387,18,false),
(389,387,32,false),
(390,390,1,false),
(391,390,14,false),
(392,390,36,false),
(393,393,1,false),
(394,393,16,false),
(395,393,36,false),
(396,396,1,false),
(397,396,14,false),
(398,396,34,false),
(399,399,1,false),
(400,399,15,false),
(401,401,1,false),
(402,401,10,false),
(403,403,1,false),
(404,403,15,false),
(405,403,30,false),
(406,406,1,false),
(407,406,35,false),
(408,408,1,false),
(409,408,30,false),
(410,410,1,false),
(411,410,30,false),
(412,412,1,false),
(413,412,20,false),
(414,412,20,false),
(415,415,1,false),
(416,415,20,false),
(417,417,1,false),
(418,418,1,false),
(419,418,26,false),
(420,420,1,false),
(421,420,25,false),
(422,422,1,false),
(423,422,20,false),
(424,190,20,false),
(425,425,1,false),
(426,425,28,false),
(427,427,1,false),
(428,427,20,false),
(429,200,20,false),
(430,198,20,false),
(431,431,1,false),
(432,431,38,false),
(433,433,1,false),
(434,434,1,false),
(435,434,34,false),
(436,436,1,false),
(437,436,33,false),
(438,438,1,false),
(439,439,1,false),
(440,440,1,false),
(441,441,1,false),
(442,442,1,false),
(443,443,1,false),
(444,443,24,false),
(445,443,48,false),
(446,446,1,false),
(447,447,1,false),
(448,447,20,false),
(449,449,1,false),
(450,449,34,false),
(451,451,1,false),
(452,451,40,false),
(453,453,1,false),
(454,453,37,false),
(455,455,1,false),
(456,456,1,false),
(457,456,31,false),
(458,458,1,false),
(459,459,1,false),
(460,459,40,false),
(461,215,20,false),
(462,81,35,false),
(463,108,20,false),
(464,111,42,false),
(465,114,20,false),
(466,239,35,false),
(467,240,35,false),
(468,175,35,false),
(469,193,20,false),
(470,133,20,false),
(471,133,20,false),
(472,207,20,false),
(473,220,35,false),
(474,137,35,false),
(475,280,35,false),
(476,299,20,false),
(477,355,37,false),
(478,361,20,false),
(479,479,1,false),
(480,480,1,true),
(481,481,1,true),
(482,482,1,true),
(483,483,1,true),
(484,484,1,true),
(485,485,1,true),
(486,486,1,true),
(487,487,1,true),
(488,488,1,true),
(489,489,1,true),
(490,490,1,true),
(491,491,1,true),
(492,492,1,true),
(493,493,1,true),
(494,494,1,true),
(495,495,1,false),
(496,495,17,false),
(497,495,36,false),
(498,498,1,false),
(499,498,17,false),
(500,498,36,false),
(501,501,1,false),
(502,501,17,false),
(503,501,36,false),
(504,504,1,false),
(505,504,20,false),
(506,506,1,false),
(507,506,16,false),
(508,506,32,false),
(509,509,1,false),
(510,509,20,false),
(511,511,1,false),
(512,511,20,false),
(513,513,1,false),
(514,513,20,false),
(515,515,1,false),
(516,515,20,false),
(517,517,1,false),
(518,517,20,false),
(519,519,1,false),
(520,519,21,false),
(521,519,32,false),
(522,522,1,false),
(523,522,27,false),
(524,524,1,false),
(525,524,25,false),
(526,524,35,false),
(527,527,1,false),
(528,527,20,false),
(529,529,1,false),
(530,529,31,false),
(531,531,1,false),
(532,532,1,false),
(533,532,25,false),
(534,532,35,false),
(535,535,1,false),
(536,535,25,false),
(537,535,36,false),
(538,538,1,false),
(539,539,1,false),
(540,540,1,false),
(541,540,20,false),
(542,540,35,false),
(543,543,1,false),
(544,543,22,false),
(545,543,30,false),
(546,546,1,false),
(547,546,20,false),
(548,548,1,false),
(549,548,20,false),
(550,550,1,false),
(551,551,1,false),
(552,551,29,false),
(553,551,40,false),
(554,554,1,false),
(555,554,35,false),
(556,556,1,false),
(557,557,1,false),
(558,557,34,false),
(559,559,1,false),
(560,559,39,false),
(561,561,1,false),
(562,562,1,false),
(563,562,34,false),
(564,564,1,false),
(565,564,37,false),
(566,566,1,false),
(567,566,37,false),
(568,568,1,false),
(569,568,36,false),
(570,570,1,false),
(571,570,30,false),
(572,572,1,false),
(573,572,20,false),
(574,574,1,false),
(575,574,32,false),
(576,574,41,false),
(577,577,1,false),
(578,577,32,false),
(579,577,41,false),
(580,580,1,false),
(581,580,35,false),
(582,582,1,false),
(583,582,35,false),
(584,582,47,false),
(585,585,1,false),
(586,585,20,false),
(587,587,1,false),
(588,588,1,false),
(589,588,20,false),
(590,590,1,false),
(591,590,39,false),
(592,592,1,false),
(593,592,40,false),
(594,594,1,false),
(595,595,1,false),
(596,595,36,false),
(597,597,1,false),
(598,597,40,false),
(599,599,1,false),
(600,599,38,false),
(601,599,49,false),
(602,602,1,false),
(603,602,39,false),
(604,602,39,false),
(605,605,1,false),
(606,605,42,false),
(607,607,1,false),
(608,607,41,false),
(609,607,41,false),
(610,610,1,false),
(611,610,38,false),
(612,610,48,false),
(613,613,1,false),
(614,613,37,false),
(615,615,1,false),
(616,616,1,false),
(617,616,20,false),
(618,618,1,false),
(619,619,1,false),
(620,619,50,false),
(621,621,1,false),
(622,622,1,false),
(623,622,43,false),
(624,624,1,false),
(625,624,52,false),
(626,626,1,false),
(627,627,1,false),
(628,627,54,false),
(629,629,1,false),
(630,629,54,false),
(631,631,1,false),
(632,632,1,false),
(633,633,1,false),
(634,633,50,false),
(635,633,64,false),
(636,636,1,false),
(637,636,59,false),
(638,638,1,true),
(639,639,1,true),
(640,640,1,true),
(641,641,1,true),
(642,642,1,true),
(643,643,1,true),
(644,644,1,true),
(645,645,1,true),
(646,646,1,true),
(647,647,1,true),
(648,648,1,true),
(649,649,1,true),
(650,650,1,false),
(651,650,16,false),
(652,650,36,false),
(653,653,1,false),
(654,653,16,false),
(655,653,36,false),
(656,656,1,false),
(657,656,16,false),
(658,656,36,false),
(659,659,1,false),
(660,659,20,false),
(661,661,1,false),
(662,661,17,false),
(663,661,35,false),
(664,664,1,false),
(665,664,20,false),
(666,664,35,false),
(667,667,1,false),
(668,667,35,false),
(669,669,1,false),
(670,669,20,false),
(671,669,35,false),
(672,672,1,false),
(673,672,32,false),
(674,674,1,false),
(675,674,20,false),
(676,676,1,false),
(677,677,1,false),
(678,677,20,false),
(679,679,1,false),
(680,679,35,false),
(681,679,35,false),
(682,682,1,false),
(683,682,20,false),
(684,684,1,false),
(685,684,20,false),
(686,686,1,false),
(687,686,20,false),
(688,688,1,false),
(689,688,39,false),
(690,690,1,false),
(691,690,48,false),
(692,692,1,false),
(693,692,37,false),
(694,694,1,false),
(695,694,20,false),
(696,696,1,false),
(697,696,20,false),
(698,698,1,false),
(699,698,20,false),
(700,133,20,false),
(701,701,1,false),
(702,702,1,false),
(703,703,1,false),
(704,704,1,false),
(705,704,40,false),
(706,704,40,false),
(707,707,1,false),
(708,708,1,false),
(709,708,20,false),
(710,710,1,false),
(711,710,20,false),
(712,712,1,false),
(713,712,37,false),
(714,714,1,false),
(715,714,48,false),
(716,716,1,true),
(717,717,1,true),
(718,718,1,true),
(719,719,1,true),
(720,720,1,true),
(721,721,1,true),
(722,722,1,false),
(723,722,17,false),
(724,722,34,false),
(725,725,1,false),
(726,725,17,false),
(727,725,34,false),
(728,728,1,false),
(729,728,17,false),
(730,728,34,false),
(731,731,1,false),
(732,731,14,false),
(733,731,28,false),
(734,734,1,false),
(735,734,20,false),
(736,736,1,false),
(737,736,20,false),
(738,736,35,false),
(739,739,1,false),
(740,739,20,false),
(741,741,1,false),
(742,742,1,false),
(743,742,25,false),
(744,744,1,false),
(745,744,20,false),
(746,746,1,false),
(747,747,1,false),
(748,747,38,false),
(749,749,1,false),
(750,749,30,false),
(751,751,1,false),
(752,751,22,false),
(753,753,1,false),
(754,753,20,false),
(755,755,1,false),
(756,755,24,false),
(757,757,1,false),
(758,757,20,false),
(759,759,1,false),
(760,759,27,false),
(761,761,1,false),
(762,761,18,false),
(763,761,35,false),
(764,764,1,false),
(765,765,1,false),
(766,766,1,false),
(767,767,1,false),
(768,767,30,false),
(769,769,1,false),
(770,769,42,false),
(771,771,1,false),
(772,772,1,true),
(773,772,20,true),
(774,774,1,false),
(775,775,1,false),
(776,776,1,false),
(777,777,1,false),
(778,778,1,false),
(779,779,1,false),
(780,780,1,false),
(781,781,1,false),
(782,782,1,false),
(783,782,35,false),
(784,782,45,false),
(785,785,1,true),
(786,786,1,true),
(787,787,1,true),
(788,788,1,true),
(789,789,1,true),
(790,789,43,true),
(791,789,53,true),
(792,789,53,true),
(793,793,1,false),
(794,794,1,false),
(795,795,1,false),
(796,796,1,false),
(797,797,1,false),
(798,798,1,false),
(799,799,1,false),
(800,800,1,true),
(801,801,1,true),
(802,802,1,true),
(803,803,1,false),
(804,803,20,false),
(805,805,1,false),
(806,806,1,false),
(807,807,1,true),
(808,808,1,true),
(809,808,20,true),
(810,810,1,false),
(811,810,16,false),
(812,810,35,false),
(813,813,1,false),
(814,813,16,false),
(815,813,35,false),
(816,816,1,false),
(817,816,16,false),
(818,816,35,false),
(819,819,1,false),
(820,819,24,false),
(821,821,1,false),
(822,821,18,false),
(823,821,38,false),
(824,824,1,false),
(825,824,10,false),
(826,824,30,false),
(827,827,1,false),
(828,827,18,false),
(829,829,1,false),
(830,829,20,false),
(831,831,1,false),
(832,831,24,false),
(833,833,1,false),
(834,833,22,false),
(835,835,1,false),
(836,835,25,false),
(837,837,1,false),
(838,837,18,false),
(839,837,34,false),
(840,840,1,false),
(841,840,20,false),
(842,840,20,false),
(843,843,1,false),
(844,843,36,false),
(845,845,1,false),
(846,846,1,false),
(847,846,26,false),
(848,848,1,false),
(849,848,20,false),
(850,850,1,false),
(851,850,28,false),
(852,852,1,false),
(853,852,20,false),
(854,854,1,false),
(855,854,20,false),
(856,856,1,false),
(857,856,32,false),
(858,856,42,false),
(859,859,1,false),
(860,859,32,false),
(861,859,42,false),
(862,263,35,false),
(863,52,20,false),
(864,222,20,false),
(865,83,20,false),
(866,439,35,false),
(867,562,20,false),
(868,868,1,false),
(869,868,20,false),
(870,870,1,false),
(871,871,1,false),
(872,872,1,false),
(873,872,20,false),
(874,874,1,false),
(875,875,1,false),
(876,876,1,false),
(877,877,1,false),
(878,878,1,false),
(879,878,34,false),
(880,880,1,false),
(881,881,1,false),
(882,882,1,false),
(883,883,1,false),
(884,884,1,false),
(885,885,1,false),
(886,885,50,false),
(887,885,60,false),
(888,888,1,true),
(889,889,1,true),
(890,890,1,true),
(891,891,1,true),
(892,891,20,true),
(893,893,1,true),
(894,894,1,true),
(895,895,1,true),
(896,896,1,true),
(897,897,1,true),
(898,898,1,true),
(899,234,20,false),
(900,123,20,false),
(901,216,35,false),
(902,550,20,false),
(903,215,20,false),
(904,211,20,false),
(905,905,1,true),
(906,906,1,false),
(907,906,16,false),
(908,906,36,false),
(909,909,1,false),
(910,909,16,false),
(911,909,36,false),
(912,912,1,false),
(913,912,16,false),
(914,912,36,false),
(915,915,1,false),
(916,915,20,false),
(917,917,1,false),
(918,917,15,false),
(919,919,1,false),
(920,919,24,false),
(921,921,1,false),
(922,921,18,false),
(923,921,35,false),
(924,924,1,false),
(925,924,20,false),
(926,926,1,false),
(927,926,26,false),
(928,928,1,false),
(929,928,25,false),
(930,928,35,false),
(931,931,1,false),
(932,932,1,false),
(933,932,24,false),
(934,932,38,false),
(935,935,1,false),
(936,935,20,false),
(937,935,20,false),
(938,938,1,false),
(939,938,20,false),
(940,940,1,false),
(941,940,25,false),
(942,942,1,false),
(943,942,30,false),
(944,944,1,false),
(945,944,28,false),
(946,946,1,false),
(947,946,20,false),
(948,948,1,false),
(949,948,30,false),
(950,950,1,false),
(951,951,1,false),
(952,951,20,false),
(953,953,1,false),
(954,953,20,false),
(955,955,1,false),
(956,955,35,false),
(957,957,1,false),
(958,957,24,false),
(959,957,38,false),
(960,960,1,false),
(961,960,26,false),
(962,962,1,false),
(963,963,1,false),
(964,963,20,false),
(965,965,1,false),
(966,965,40,false),
(967,967,1,false),
(968,968,1,false),
(969,969,1,false),
(970,969,35,false),
(971,971,1,false),
(972,971,20,false),
(973,973,1,false),
(974,974,1,false),
(975,974,20,false),
(976,976,1,false),
(977,977,1,false),
(978,978,1,false),
(979,56,35,false),
(980,194,20,false);
create table arena_private.campaign_accounts(user_id uuid primary key references auth.users(id) on delete cascade,created_at timestamptz not null default clock_timestamp());
create table arena_private.campaign_claims(user_id uuid not null references auth.users(id) on delete cascade,key text not null,reward jsonb not null default '{}',created_at timestamptz not null default clock_timestamp(),primary key(user_id,key));
create table arena_private.campaign_operations(user_id uuid not null references auth.users(id) on delete cascade,request_id uuid not null,action text not null,payload_hash text not null,response jsonb not null,primary key(user_id,request_id));
create table arena_private.campaign_hunts(user_id uuid primary key references auth.users(id) on delete cascade,id uuid not null default gen_random_uuid(),day date not null,region text not null,root integer not null,remaining integer not null check(remaining between 0 and 20));
create table arena_private.campaign_runs(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,key text not null,definition jsonb not null,entries jsonb not null,started_at timestamptz not null default clock_timestamp(),expires_at timestamptz not null default clock_timestamp()+interval '1 hour',verified boolean not null default false,won boolean,duration numeric check(duration between 0 and 301),verification_state jsonb,verification_revision integer not null default 0);
create index campaign_runs_owner on arena_private.campaign_runs(user_id,started_at desc);
do $$ declare t text;begin
 foreach t in array array['campaign_regions','campaign_families','campaign_accounts','campaign_claims','campaign_operations','campaign_hunts','campaign_runs'] loop
  execute format('alter table arena_private.%I enable row level security',t);
  execute format('revoke all on arena_private.%I from public,anon,authenticated',t);
 end loop;
end $$;

create function arena_private.campaign_complete(document jsonb,region_name text,master boolean default false)
returns boolean language sql stable set search_path=pg_catalog as $$
 select coalesce((select bool_and(d.badges ? b.badge) from arena_private.campaign_regions r
  cross join lateral unnest(r.badges) b(badge)
  cross join lateral(select arena_private.market_entry(document,case when master then 'pokemon-arena-gym-badges/master' else 'pokemon-arena-gym-badges' end,'[]') badges) d
  where r.region=region_name),false)
$$;
create function arena_private.campaign_capacity(document jsonb)
returns integer language sql stable set search_path=pg_catalog as $$
 select 2+case when arena_private.campaign_complete(document,'Kanto') then 2 else 0 end+case when arena_private.campaign_complete(document,'Sinnoh') then 2 else 0 end
$$;

alter function arena_private.save_issue(jsonb) rename to save_issue_before_campaign;
create function arena_private.save_issue(document jsonb)
returns text language plpgsql stable set search_path=pg_catalog as $$
declare issue text;std jsonb;masters jsonb;ordered jsonb;badge text;
begin
 -- Validate the existing save envelope and inventory, then apply regional Master prerequisites.
 issue:=arena_private.save_issue_before_campaign(jsonb_set(document,'{entries,pokemon-arena-gym-badges/master}',to_jsonb('[]'::text),true));
 if issue is not null then return issue;end if;
 std:=arena_private.market_entry(document,'pokemon-arena-gym-badges','[]');
 masters:=arena_private.market_entry(document,'pokemon-arena-gym-badges/master','[]');
 if jsonb_typeof(std)<>'array' or jsonb_typeof(masters)<>'array' or jsonb_array_length(std)>68 or jsonb_array_length(masters)>68 then return 'campaign_badge_format';end if;
 select coalesce(jsonb_agg(to_jsonb(q.badge) order by q.ordinal,q.position),'[]') into ordered from
  (select b.badge,r.ordinal,b.position from arena_private.campaign_regions r cross join lateral unnest(r.badges) with ordinality b(badge,position) order by r.ordinal,b.position limit jsonb_array_length(std)) q;
 if std is distinct from ordered then return 'campaign_badge_order';end if;
 if (select count(distinct value) from jsonb_array_elements(masters))<>jsonb_array_length(masters) then return 'campaign_badge_format';end if;
 for badge in select jsonb_array_elements_text(masters) loop
  if not exists(select 1 from arena_private.campaign_regions r where badge=any(r.badges) and arena_private.campaign_complete(document,r.region)) then return 'campaign_master_locked';end if;
 end loop;
 return null;
exception when others then return 'campaign_badge_format';end $$;

create function arena_private.campaign_save_issue(uid uuid,document jsonb)
returns text language plpgsql stable set search_path=pg_catalog as $$
<<campaign_save>>
declare c jsonb;presets jsonb;preset jsonb;name text;members jsonb;hunt jsonb;stored arena_private.campaign_hunts;selected text;
begin
 c:=arena_private.market_entry(document,'pokemon-arena-wild-progress','{}')->'campaign';if c is null then return null;end if;
 if jsonb_typeof(c)<>'object' then return 'campaign_settings_format';end if;
 if c ? 'claimed' and (jsonb_typeof(c->'claimed')<>'array' or jsonb_array_length(c->'claimed')>1000) then return 'campaign_receipt_format';end if;
 presets:=coalesce(c->'presets','[]');
 if jsonb_typeof(presets)<>'array' or jsonb_array_length(presets)>arena_private.campaign_capacity(document) then return 'campaign_preset_capacity';end if;
 for preset in select value from jsonb_array_elements(presets) where value<>'null'::jsonb loop
  if jsonb_typeof(preset)<>'object' or length(preset->>'name') not between 1 and 40 or jsonb_typeof(preset->'team') is distinct from 'array' then return 'campaign_preset_format';end if;
  members:=preset->'team';
  if jsonb_array_length(members) not between 1 and 6 or (select count(distinct value) from jsonb_array_elements(members))<>jsonb_array_length(members) then return 'campaign_preset_format';end if;
  for name in select jsonb_array_elements_text(members) loop
   if not exists(select 1 from arena_private.market_species where market_species.name=campaign_save.name) then return 'campaign_preset_species';end if;
   if jsonb_typeof(preset->'moves'->name) is distinct from 'array' or jsonb_array_length(preset->'moves'->name) not between 1 and 4 then return 'campaign_preset_moves';end if;
  end loop;
 end loop;
 selected:=coalesce(c->>'title','');
 if selected<>'' and not(selected='Champion' and arena_private.campaign_complete(document,'Paldea')) and not exists(select 1 from arena_private.campaign_regions r where selected=r.region||' Master' and arena_private.campaign_complete(document,r.region,true)) then return 'campaign_title_locked';end if;
 selected:=coalesce(c->>'appearance','');
 if selected<>'' and not arena_private.campaign_complete(document,selected,true) then return 'campaign_appearance_locked';end if;
 if c->'laurel'='true'::jsonb and not arena_private.campaign_complete(document,'Kalos') then return 'campaign_frame_locked';end if;
 hunt:=c->'hunt';
 if hunt is not null and hunt<>'null'::jsonb then
  select * into stored from arena_private.campaign_hunts where user_id=uid;
  if stored.user_id is null then
   if exists(select 1 from arena_private.campaign_accounts where user_id=uid) then return 'campaign_hunt_identity';end if;
  elsif hunt->>'id' is distinct from stored.id::text or hunt->>'day' is distinct from stored.day::text or hunt->>'region' is distinct from stored.region or
   hunt->>'root' is distinct from stored.root::text or not arena_private.whole_number(hunt->'remaining',0,stored.remaining) then return 'campaign_hunt_tamper';end if;
 end if;
 return null;
exception when others then return 'campaign_settings_format';end $$;

create function arena_private.campaign_save_guard() returns trigger language plpgsql security definer set search_path=pg_catalog as $$
declare issue text;hunt jsonb;
begin
 issue:=arena_private.campaign_save_issue(new.user_id,new.save_data);
 if issue is not null then raise exception 'Campaign integrity check failed: %',issue;end if;
 hunt:=arena_private.market_entry(new.save_data,'pokemon-arena-wild-progress','{}')->'campaign'->'hunt';
 if hunt is not null and hunt<>'null'::jsonb then
  update arena_private.campaign_hunts set remaining=(hunt->>'remaining')::integer where user_id=new.user_id and id::text=hunt->>'id' and remaining>=(hunt->>'remaining')::integer;
 end if;
 return new;
end $$;
create trigger arena_campaign_save_guard before insert or update of save_data on public.arena_saves for each row execute function arena_private.campaign_save_guard();
alter function public.arena_write_save(jsonb,timestamptz) rename to arena_write_save_before_campaign;
revoke all on function public.arena_write_save_before_campaign(jsonb,timestamptz) from public,anon,authenticated;
create function public.arena_write_save(payload jsonb,expected_revision timestamptz)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid:=auth.uid();stamp timestamptz;issue text;
begin
 perform arena_private.require_session();perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 select updated_at into stamp from public.arena_saves where user_id=uid for update;
 if stamp is not distinct from expected_revision then
  issue:=coalesce(arena_private.save_issue(payload),arena_private.campaign_save_issue(uid,payload));
  if issue is not null then
   insert into arena_private.market_security_events(user_id,reason) values(uid,issue);
   return jsonb_build_object('status','rejected','reason',issue);
  end if;
 end if;
 return public.arena_write_save_before_campaign(payload,expected_revision);
end $$;
revoke all on function public.arena_write_save(jsonb,timestamptz) from public,anon;
grant execute on function public.arena_write_save(jsonb,timestamptz) to authenticated;

create function arena_private.campaign_contracts(uid uuid,document jsonb)
returns jsonb language plpgsql stable set search_path=pg_catalog as $$
declare today text:=(clock_timestamp() at time zone 'UTC')::date::text;week text:=date_trunc('week',clock_timestamp() at time zone 'UTC')::date::text;
 available text[];region text;slot integer;seed bigint;reward jsonb;cards jsonb:='[]';training boolean;elite boolean;
begin
 if not arena_private.campaign_complete(document,'Johto') then return cards;end if;
 select array_agg(r.region order by ordinal) into available from arena_private.campaign_regions r where arena_private.campaign_complete(document,r.region);
 training:=arena_private.campaign_complete(document,'Sinnoh');elite:=arena_private.campaign_complete(document,'Galar');
 for slot in 0..1 loop
  seed:=hashtextextended(uid::text||today||slot,17138)&4294967295;region:=available[1+seed%cardinality(available)];
  reward:=jsonb_build_object('coins',case when training then 1000 else 750 end,'vitamins',case when training then '{"EXP Candy 500":1,"Protein":1}'::jsonb else '{"EXP Candy 250":1}'::jsonb end);
  cards:=cards||jsonb_build_array(jsonb_build_object('key','daily:'||today||':'||slot,'kind','daily','period',today,'region',region,'slot',slot,'seed',seed,'reward',reward));
 end loop;
 if arena_private.campaign_complete(document,'Unova') then for slot in 0..1 loop
  seed:=hashtextextended(uid::text||week||slot,17138)&4294967295;region:=available[1+seed%cardinality(available)];
  reward:=jsonb_build_object('coins',case when elite then 5000 else 3000 end,'capsules',1,'vitamins',jsonb_build_object('Rare Candy',case when elite then 2 else 1 end,'EXP Candy 500',case when elite then 3 else 2 end));
  cards:=cards||jsonb_build_array(jsonb_build_object('key','elite:'||week||':'||slot,'kind','elite','period',week,'region',region,'slot',slot,'seed',seed,'reward',reward));
 end loop;end if;
 return cards;
end $$;
create function arena_private.campaign_hunt_choices(uid uuid,document jsonb,region_name text)
returns jsonb language sql stable set search_path=pg_catalog as $$
 select coalesce(jsonb_agg(to_jsonb(choices)-'position' order by position),'[]') from (
  select f.root,(array_agg(s.name order by s.dex))[1] name,min(f.min_level) min_level,
   row_number() over(order by md5(uid::text||(clock_timestamp() at time zone 'UTC')::date::text||f.root)) position
  from arena_private.market_species s join arena_private.campaign_families f using(dex) join arena_private.campaign_regions r on r.generation=s.generation
  where r.region=region_name and not f.rare group by f.root
  order by position limit case when arena_private.campaign_complete(document,'Kalos') then 6 else 3 end
 ) choices
$$;
create function arena_private.campaign_status(uid uuid,document jsonb)
returns jsonb language plpgsql stable set search_path=pg_catalog as $$
declare hunts jsonb:='{}';region record;hunt jsonb;today date:=(clock_timestamp() at time zone 'UTC')::date;
begin
 if arena_private.campaign_complete(document,'Hoenn') then
  for region in select r.region from arena_private.campaign_regions r where arena_private.campaign_complete(document,r.region) loop
   hunts:=hunts||jsonb_build_object(region.region,arena_private.campaign_hunt_choices(uid,document,region.region));
  end loop;
 end if;
 select jsonb_build_object('id',id,'day',day,'region',campaign_hunts.region,'root',root,'remaining',remaining) into hunt from arena_private.campaign_hunts where user_id=uid;
 return jsonb_build_object('server_now',clock_timestamp(),'day',today,'claimed',coalesce((select jsonb_agg(key order by key) from arena_private.campaign_claims c where c.user_id=uid and (c.key like 'standard:%' or c.key like 'master:%' or c.key like 'daily:'||today::text||':%' or c.key like 'elite:'||date_trunc('week',clock_timestamp() at time zone 'UTC')::date::text||':%')),'[]'),
  'contracts',arena_private.campaign_contracts(uid,document),'hunts',hunts,'hunt',hunt,
  'hunt_used',exists(select 1 from arena_private.campaign_hunts where user_id=uid and day=today),
  'recoverable',coalesce((select jsonb_agg(jsonb_build_object('run_id',id,'region',definition->>'region')) from
    (select distinct on(key) * from arena_private.campaign_runs r where user_id=uid and expires_at>clock_timestamp() and (won is null or won) and not exists(select 1 from arena_private.campaign_claims c where c.user_id=uid and c.key=r.key) order by key,started_at desc) q),'[]'));
end $$;
create function arena_private.campaign_reward(document jsonb,reward jsonb)
returns jsonb language plpgsql stable set search_path=pg_catalog as $$
declare p jsonb;entry record;multiplier integer:=1;masters jsonb;
begin
 p:=arena_private.market_entry(document,'pokemon-arena-wild-progress','{}');
 masters:=arena_private.market_entry(document,'pokemon-arena-gym-badges/master','[]');
 if jsonb_array_length(masters)=68 and not exists(select 1 from arena_private.campaign_regions r where not arena_private.campaign_complete(document,r.region,true)) then multiplier:=2;end if;
 p:=jsonb_set(p,'{coins}',to_jsonb(coalesce((p->>'coins')::bigint,0)+(reward->>'coins')::bigint*multiplier));
 p:=jsonb_set(p,'{vitamins}',coalesce(p->'vitamins','{}'));p:=jsonb_set(p,'{capsules}',to_jsonb(coalesce((p->>'capsules')::bigint,0)+coalesce((reward->>'capsules')::integer,0)));
 for entry in select * from jsonb_each_text(coalesce(reward->'vitamins','{}')) loop
  p:=jsonb_set(p,array['vitamins',entry.key],to_jsonb(coalesce((p->'vitamins'->>entry.key)::bigint,0)+entry.value::integer));
 end loop;
 return arena_private.market_set(document,'pokemon-arena-wild-progress',p);
end $$;

create function arena_private.campaign_build_entries(document jsonb)
returns jsonb language plpgsql stable set search_path=pg_catalog as $$
declare team jsonb:=arena_private.market_entry(document,'pokemon-arena-team','[]');p jsonb:=arena_private.market_entry(document,'pokemon-arena-wild-progress','{}');profiles jsonb:=arena_private.market_entry(document,'pokemon-arena-profiles','{}');moves jsonb:=arena_private.market_entry(document,'pokemon-arena-moves','{}');owned jsonb;ai jsonb;selected_profiles jsonb;selected_moves jsonb;
begin
 select coalesce(jsonb_object_agg(name,p->'owned'->name),'{}'),coalesce(jsonb_object_agg(name,p->'ai'->name),'{}'),coalesce(jsonb_object_agg(name,moves->name),'{}') into owned,ai,selected_moves from jsonb_array_elements_text(team) names(name);
 select coalesce(jsonb_object_agg(s.dex::text,profiles->s.dex::text),'{}') into selected_profiles from arena_private.market_species s where team ? s.name;
 return jsonb_build_object('pokemon-arena-team',team::text,'pokemon-arena-moves',selected_moves::text,'pokemon-arena-profiles',selected_profiles::text,
  'pokemon-arena-wild-progress',jsonb_build_object('owned',owned,'ai',ai,'held',coalesce(p->'held','{}'),'items',coalesce(p->'items','{}'),'battlePlan',p->'battlePlan','battleCarry',p->'battleCarry')::text);
end $$;

create function public.arena_campaign(action text,args jsonb default '{}')
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
#variable_conflict use_variable
<<campaign>>
declare uid uuid:=auth.uid();saved jsonb;revision timestamptz;expected timestamptz;issue text;request_id uuid;request_hash text;op arena_private.campaign_operations;
 row arena_private.campaign_regions;master boolean;key text;reward jsonb;response jsonb;state jsonb;p jsonb;created boolean;token text;contract jsonb;run arena_private.campaign_runs;root integer;today date:=(clock_timestamp() at time zone 'UTC')::date;
begin
 perform arena_private.require_session();if uid is null then raise exception 'Sign in to open account progression.';end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 select save_data,updated_at into saved,revision from public.arena_saves where user_id=uid for update;
 if saved is null then raise exception 'Sync your progress first.';end if;
 issue:=arena_private.save_issue(saved);if issue is not null then raise exception 'Your save must pass validation before claiming rewards.';end if;
 insert into arena_private.campaign_accounts(user_id) values(uid) on conflict do nothing;created:=found;
 if created then
  -- Credit valid offline receipts once when an account first adopts this release.
  for token in select jsonb_array_elements_text(coalesce(arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}')->'campaign'->'claimed','[]')) loop
   if token like 'standard:%' and arena_private.campaign_complete(saved,substring(token from 10)) or token like 'master:%' and arena_private.campaign_complete(saved,substring(token from 8),true) or exists(select 1 from jsonb_array_elements(arena_private.campaign_contracts(uid,saved)) card where card->>'key'=token) then
    insert into arena_private.campaign_claims(user_id,key) values(uid,token) on conflict do nothing;
   end if;
  end loop;
 end if;
 if action='status' then return arena_private.campaign_status(uid,saved);end if;
 if action not in ('claim_region','start_hunt','start_contract','claim_contract') then raise exception 'Unknown progression action.';end if;
 if exists(select 1 from jsonb_object_keys(args) field where field not in ('region','master','root','key','run_id','request_id','expected_revision')) then raise exception 'Unexpected progression argument.';end if;
 request_id:=(args->>'request_id')::uuid;if request_id is null then raise exception 'This transaction needs an identifier.';end if;
 request_hash:=md5(action||(args-'request_id'-'expected_revision')::text);
 select * into op from arena_private.campaign_operations o where o.user_id=uid and o.request_id=campaign.request_id;
 if op.user_id is not null then
  if op.action<>action or op.payload_hash<>request_hash then raise exception 'Transaction identifier was reused for another operation.';end if;
  return op.response||jsonb_build_object('save_data',saved,'updated_at',revision,'replayed',true,'campaign',arena_private.campaign_status(uid,saved));
 end if;
 expected:=(args->>'expected_revision')::timestamptz;
 if expected is distinct from revision then return jsonb_build_object('status','conflict','message','Progress changed. Sync before claiming rewards.');end if;
 if action='claim_region' then
  select * into row from arena_private.campaign_regions where region=args->>'region';master:=coalesce((args->>'master')::boolean,false);
  if row.region is null or not arena_private.campaign_complete(saved,row.region,master) then raise exception 'Complete this region before claiming its bundle.';end if;
  key:=case when master then 'master:' else 'standard:' end||row.region;
  reward:=jsonb_build_object('coins',row.coins*case when master then 2 else 1 end,'vitamins',jsonb_build_object('Rare Candy',case when master then row.master_candy else row.candy end,'EXP Candy 500',case when master then 2+(row.ordinal-1)/2 else 1+(row.ordinal-1)/3 end));
  insert into arena_private.campaign_claims(user_id,key,reward) values(uid,key,reward) on conflict do nothing;
  if found then saved:=arena_private.campaign_reward(saved,reward);response:=jsonb_build_object('message',row.region||case when master then ' Master' else '' end||' rewards received.','reward',reward);
  else response:='{"message":"This regional reward was already claimed."}';end if;
 elsif action='start_hunt' then
  root:=(args->>'root')::integer;
  if not arena_private.campaign_complete(saved,'Hoenn') or not arena_private.campaign_complete(saved,args->>'region') then raise exception 'Clear Hoenn and the selected region first.';end if;
  if exists(select 1 from arena_private.campaign_hunts h where h.user_id=uid and h.day=today) then raise exception 'Today’s hunt has already been started.';end if;
  if not exists(select 1 from jsonb_array_elements(arena_private.campaign_hunt_choices(uid,saved,args->>'region')) choice where (choice->>'root')::integer=root) then raise exception 'Choose a family from today’s hunt board.';end if;
  insert into arena_private.campaign_hunts(user_id,day,region,root,remaining) values(uid,today,args->>'region',root,20)
   on conflict(user_id) do update set id=gen_random_uuid(),day=excluded.day,region=excluded.region,root=excluded.root,remaining=20;
  state:=arena_private.campaign_status(uid,saved);p:=arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}');
  p:=jsonb_set(p,'{campaign}',coalesce(p->'campaign','{}')||jsonb_build_object('hunt',(state->'hunt')));
  saved:=arena_private.market_set(saved,'pokemon-arena-wild-progress',p);response:='{"message":"Family hunt started."}';
 elsif action='start_contract' then
  select value into contract from jsonb_array_elements(arena_private.campaign_contracts(uid,saved)) where value->>'key'=args->>'key';
  if contract is null then raise exception 'This contract is locked or has expired.';end if;
  if contract->>'kind'='elite' and jsonb_array_length(arena_private.market_entry(saved,'pokemon-arena-team','[]'))<>6 then raise exception 'Elite contracts require a full six-Pokémon team.';end if;
  key:=contract->>'key';
  if exists(select 1 from arena_private.campaign_claims c where c.user_id=uid and c.key=key) then raise exception 'This contract reward was already claimed.';end if;
  if exists(select 1 from arena_private.campaign_runs r where r.user_id=uid and r.started_at>clock_timestamp()-interval '10 seconds') then raise exception 'Wait 10 seconds before starting another contract.';end if;
  if (select count(*) from arena_private.campaign_runs r where r.user_id=uid and r.started_at>clock_timestamp()-interval '1 minute')>=8 then raise exception 'Too many contract starts. Try again shortly.';end if;
  delete from arena_private.campaign_runs r where r.user_id=uid and r.expires_at<clock_timestamp()-interval '7 days';
  insert into arena_private.campaign_runs(user_id,key,definition,entries) values(uid,key,contract,arena_private.campaign_build_entries(saved)) returning * into run;
  response:=jsonb_build_object('run_id',run.id,'message','Contract team saved.');
 elsif action='claim_contract' then
  select * into run from arena_private.campaign_runs r where r.id=(args->>'run_id')::uuid and r.user_id=uid for update;
  if run.id is null or not run.verified or run.won is distinct from true then raise exception 'Win and verify this contract first.';end if;
  key:=run.key;
  if not exists(select 1 from arena_private.campaign_claims c where c.user_id=uid and c.key=key) then
   if run.expires_at<clock_timestamp() then raise exception 'This contract has expired.';end if;
   if clock_timestamp()<run.started_at+make_interval(secs=>greatest(0,run.duration::double precision-2)) then raise exception 'The contract battle is still in progress.';end if;
  end if;
  reward:=run.definition->'reward';
  insert into arena_private.campaign_claims(user_id,key,reward) values(uid,key,reward) on conflict do nothing;
  if found then saved:=arena_private.campaign_reward(saved,reward);response:=jsonb_build_object('reward',reward,'message','Contract rewards received.');
  else response:='{"message":"This contract reward was already claimed."}';end if;
 end if;
 issue:=coalesce(arena_private.save_issue(saved),arena_private.campaign_save_issue(uid,saved));if issue is not null then raise exception 'Progress validation failed: %',issue;end if;
 revision:=clock_timestamp();update public.arena_saves set save_data=saved,updated_at=revision where user_id=uid;
 response:=coalesce(response,'{}')||jsonb_build_object('status','ok');
 insert into arena_private.campaign_operations(user_id,request_id,action,payload_hash,response) values(uid,request_id,action,request_hash,response);
 return response||jsonb_build_object('save_data',saved,'updated_at',revision,'campaign',arena_private.campaign_status(uid,saved));
exception when others then
 if uid is not null then insert into arena_private.market_security_events(user_id,reason,details) values(uid,'campaign_rejection',jsonb_build_object('action',action,'message',left(sqlerrm,500)));end if;
 return jsonb_build_object('status','error','message',case when sqlstate='P0001' then sqlerrm else 'Progression could not sync. Refresh and try again.' end);
end $$;
revoke all on function public.arena_campaign(text,jsonb) from public,anon;
grant execute on function public.arena_campaign(text,jsonb) to authenticated;

create function public.arena_campaign_read(player_id uuid,run_id uuid)
returns jsonb language sql security definer set search_path=pg_catalog as $$
 select jsonb_build_object('id',id,'definition',definition,'entries',entries,'verified',verified,'won',won,'duration',duration,'verification_state',verification_state,'verification_revision',verification_revision) from arena_private.campaign_runs
 where id=run_id and user_id=player_id and expires_at>clock_timestamp()
$$;
create function public.arena_campaign_finish(player_id uuid,run_id uuid,won boolean,duration numeric)
returns boolean language plpgsql security definer set search_path=pg_catalog as $$
<<verified_result>>
begin
 if duration is null or duration not between 0 and 301 or won is null then raise exception 'Invalid verified outcome.';end if;
 update arena_private.campaign_runs r set verified=true,won=$3,duration=$4
 where r.id=run_id and r.user_id=player_id and not verified and expires_at>clock_timestamp();return found;
end $$;
revoke all on function public.arena_campaign_read(uuid,uuid) from public,anon,authenticated;
revoke all on function public.arena_campaign_finish(uuid,uuid,boolean,numeric) from public,anon,authenticated;
grant execute on function public.arena_campaign_read(uuid,uuid) to service_role;
grant execute on function public.arena_campaign_finish(uuid,uuid,boolean,numeric) to service_role;
create function public.arena_campaign_checkpoint(player_id uuid,run_id uuid,revision integer,state jsonb,won boolean)
returns boolean language plpgsql security definer set search_path=pg_catalog as $$
declare current_run arena_private.campaign_runs;next_clock numeric;
begin
 select * into current_run from arena_private.campaign_runs r where r.id=$2 and r.user_id=$1 and r.expires_at>clock_timestamp() for update;
 if current_run.id is null or current_run.verified or current_run.verification_revision<>$3 then return false;end if;
 next_clock:=($4->>'clock')::numeric;
 if next_clock is null or next_clock not between 0 and 301 or next_clock<coalesce(current_run.duration,0) or next_clock>coalesce(current_run.duration,0)+10.01 then raise exception 'Invalid contract checkpoint.';end if;
 update arena_private.campaign_runs r set verification_state=case when $5 is null then $4 else null end,
  verification_revision=$3+1,duration=next_clock,verified=($5 is not null),won=$5 where r.id=$2;
 return true;
end $$;
revoke all on function public.arena_campaign_checkpoint(uuid,uuid,integer,jsonb,boolean) from public,anon,authenticated;
grant execute on function public.arena_campaign_checkpoint(uuid,uuid,integer,jsonb,boolean) to service_role;
notify pgrst,'reload schema';
commit;
