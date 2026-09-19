"""并行动画的延时不能逐项相加，否则会生成数分钟的无效停留。"""
import unittest
from types import SimpleNamespace as NS
from export_presentations import prepare_slide


class Sequence(list):
    @property
    def Count(self):
        return len(self)

    def Item(self, i):
        return self[i - 1]


def effect(trigger, delay, duration):
    return NS(Timing=NS(TriggerType=trigger, TriggerDelayTime=delay,
                       Duration=duration, RepeatCount=1, AutoReverse=False),
              EffectType=10, Shape=NS(Id=1))


class ExportTimingTests(unittest.TestCase):
    def test_animated_image_gets_complete_cycle(self):
        slide = NS(SlideIndex=1, Shapes=[], TimeLine=NS(MainSequence=Sequence()),
                   SlideShowTransition=NS(AdvanceTime=0, AdvanceOnTime=False, Duration=1))
        result = prepare_slide(slide, [{'file':'motion.gif','duration':16.03}])
        self.assertEqual(result['advance'], 19)

    def test_parallel_delays_share_group_origin(self):
        seq = Sequence([effect(3, 0, 30), effect(2, 6, .5), effect(2, 6, .5),
                        effect(2, 25, .5), effect(2, 25, .5)])
        slide = NS(SlideIndex=1, Shapes=[], TimeLine=NS(MainSequence=seq),
                   SlideShowTransition=NS(AdvanceTime=0, AdvanceOnTime=False, Duration=1))
        result = prepare_slide(slide)
        self.assertEqual(result['advance'], 32)
        self.assertEqual([e['start'] for e in result['effects']], [0, 6, 6, 25, 25])


if __name__ == '__main__':
    unittest.main()
