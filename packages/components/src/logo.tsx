import Link from 'next/link';
import { cn } from '~/utils/src/cn';

export default function SiteLogo({
  className = 'py-5 pl-2',
  showName = true,
  logoSize = 'size-5'
}: {
  className?: string;
  showName?: boolean;
  logoSize?: string;
}) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex gap-x-2 items-center hover:cursor-pointer group',
        className
      )}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('rounded', logoSize)}
        viewBox="0 0 196 196" // Adjusted the viewBox to fit the SVG content
      >
        <path
          d="M0 0 C64.68 0 129.36 0 196 0 C196 64.68 196 129.36 196 196 C131.32 196 66.64 196 0 196 C0 131.32 0 66.64 0 0 Z "
          fill="#6725F1"
        />
        <path
          d="M0 0 C3.69813356 1.3972311 7.09595998 3.06564695 10.55078125 4.984375 C11.62908203 5.5825 12.70738281 6.180625 13.81835938 6.796875 C14.98319798 7.44769288 16.14790819 8.09874061 17.3125 8.75 C17.90957764 9.08257812 18.50665527 9.41515625 19.12182617 9.7578125 C28.46138829 14.96066226 37.71400382 20.30062861 46.92797852 25.72314453 C54.4692221 30.14659504 62.09303052 34.40556801 69.75 38.625 C80.99574396 44.82390496 92.05517069 51.28501973 103 58 C102 60 102 60 100.21264648 60.69848633 C99.43993408 60.90755615 98.66722168 61.11662598 97.87109375 61.33203125 C96.57619019 61.69047119 96.57619019 61.69047119 95.25512695 62.05615234 C94.32531006 62.30574707 93.39549316 62.5553418 92.4375 62.8125 C90.5229562 63.34070647 88.60889783 63.87067541 86.6953125 64.40234375 C85.73786133 64.66772949 84.78041016 64.93311523 83.79394531 65.20654297 C79.09597679 66.54072662 74.44628776 68.02199921 69.80053711 69.52661133 C65.20129864 71 65.20129864 71 63 71 C64.52020258 73.35457573 66.04121433 75.70862413 67.5625 78.0625 C68.04195068 78.80532227 68.52140137 79.54814453 69.01538086 80.31347656 C71.98928604 84.91441808 74.98416566 89.50063664 78 94.07421875 C78.67345459 95.09829834 79.34690918 96.12237793 80.04077148 97.17749023 C81.37259809 99.20152572 82.70796371 101.22323762 84.04711914 103.24243164 C84.66192139 104.17821045 85.27672363 105.11398926 85.91015625 106.078125 C86.45808838 106.90731445 87.00602051 107.73650391 87.57055664 108.59082031 C89 111 89 111 91 116 C85.06 119.96 79.12 123.92 73 128 C68.92484525 125.96242262 68.21992078 125.29093819 65.96875 121.625 C65.41074707 120.72990723 64.85274414 119.83481445 64.27783203 118.91259766 C63.69114746 117.95144043 63.10446289 116.9902832 62.5 116 C61.25951566 114.00675154 60.01729736 112.01458126 58.7734375 110.0234375 C57.83516113 108.51668457 57.83516113 108.51668457 56.87792969 106.97949219 C54.03887342 102.47509246 51.09244159 98.04551445 48.125 93.625 C47.60744141 92.85285156 47.08988281 92.08070312 46.55664062 91.28515625 C45.37313119 89.52206812 44.18691006 87.76080063 43 86 C38.97354068 89.9809626 35.059618 94.05643542 31.1875 98.1875 C30.57165039 98.84371338 29.95580078 99.49992676 29.32128906 100.17602539 C25.09501993 104.71965377 21.17156165 109.36845562 17.453125 114.33984375 C16.73382813 115.16162109 16.73382813 115.16162109 16 116 C15.34 116 14.68 116 14 116 C12.28510652 105.33360579 10.80312196 94.66875433 9.65625 83.92578125 C8.49651578 73.28477571 7.25436969 62.65614555 5.95703125 52.03125 C5.86957327 51.31409632 5.78211529 50.59694263 5.69200706 49.85805702 C4.97500304 43.98083527 4.25472656 38.10401582 3.53363037 32.22729492 C2.98768265 27.77749425 2.44313861 23.32752668 1.90064049 18.87730408 C1.64943547 16.82138719 1.39614217 14.76573456 1.14277649 12.71008301 C0.99229355 11.47608765 0.84181061 10.24209229 0.68676758 8.97070312 C0.48716179 7.34412781 0.48716179 7.34412781 0.28352356 5.68469238 C0 3 0 3 0 0 Z "
          fill="#FDFDFE"
          transform="translate(55,38)"
        />
      </svg>
      {showName && (
        <h1 className="font-bold font-poppins group-hover:text-white/60 duration-300">
          Layowt
        </h1>
      )}
    </Link>
  );
}
