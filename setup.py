# SPDX-FileCopyrightText: Bosch Rexroth AG
#
# SPDX-License-Identifier: MIT
from setuptools import setup

setup(name='amr-map',
      version='2.3.0',
      description='Web visualization for AMR SLAM data',
      author='bdkautzman',
      install_requires=['cysystemd','PyJWT', 'ctrlx-datalayer<=3.5', 'ctrlx-fbs'],
      scripts=['main.py'],
      packages=['app', 'web'],
      license='MIT License'
      )
